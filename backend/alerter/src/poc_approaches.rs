use std::time::Duration;
use futures_util::{StreamExt, TryStreamExt};
use log;
use anyhow::Context;
use mongodb::bson::doc;
use crate::database::{MongoDbApis, Alert};

macro_rules! elevate {
    ($to_match: expr, $e: pat, $on_error: expr) => {
        match $to_match {
            Ok(o) => o,
            Err($e) => $on_error
        }
    };
}

//
// With what is hinted at by the initial database models, it seems like the initial intent was to 
// have an alert created for each sensor reading that breaches the high, low thresholds.
// This is the below approach- though one concern is an unreasonable amount of alerts can be 
// created, say if a sensor just has a high frequency; they'd also be kind of redundant.
//
#[allow(dead_code)]
pub async fn approach_1(mongodb_apis: &mut MongoDbApis) -> anyhow::Result<()> {
    let mut readings_changes = mongodb_apis.readings_collection.watch(None, None).await
        .with_context(|| "Failed to initiate watching of the sensor readings collection")?;
    loop {
        let readings_change = match readings_changes.next().await.transpose() { 
            Err(e) => { log::error!("Encountered error when iterating over sensor readings changes... {e}"); continue },
            Ok(None) => { log::debug!("Encountered the end of the sensor readings changes stream"); continue }, 
            Ok(Some(x)) => x,
        };
        let sensor_reading = match (readings_change.operation_type, readings_change.full_document) {
            (mongodb::change_stream::event::OperationType::Insert, Some(x)) => x,    
            (_, _) => { log::trace!("Skipping change event as it is not of interest"); continue }
        };
        
        let corresponding_sensor = match mongodb_apis.sensor_collection.find_one(doc! { "_id": sensor_reading.sensor_id }, None).await {
            Err(e) => { log::error!("Encountered error when trying to find sensor relating to reading... {e}"); continue },
            Ok(None) => { log::warn!("Could not find a sensor corresponding to the given reading"); continue },
            Ok(Some(x)) => x
        };

        for alert_definition in corresponding_sensor.alert_definitions {
            if sensor_reading.data < alert_definition.lo_limit 
            || sensor_reading.data > alert_definition.hi_limit {
                let new_alert = Alert::from_alert_definition(&None, &alert_definition, &corresponding_sensor.id, &sensor_reading.time);
                let _ = match mongodb_apis.alerts_collection.insert_one(&new_alert, None).await {
                    Err(e) => { log::error!("Encountered error when creating alert... {e}"); continue },
                    Ok(_) => log::info!("Created an alert") 
                };
            }
        }
    }
}

//
// This approach creates alerts in a manner that attemps to have them padded, spaced out from one-another,
// to make consistent (or tunable) the amount of alerts that get created based on the 
// time a sensor spends breaching thresholds.
//
// It is not precise, though ideally it would be. 
// TODO: Use timeslots unrelated to sensor readings to enable more consistency 
//
#[allow(dead_code)]
pub async fn approach_2(mongodb_apis: &mut MongoDbApis) {
    loop {
        let current_datetime = chrono::Utc::now();
        let trail_duration = Duration::from_secs(60 * 60);
        let alert_proximity = Duration::from_secs(60);

        let mut all_sensors = elevate!(mongodb_apis.sensor_collection.find(None, None).await, e, {
            log::error!("Could not query all sensors... {e}");
            continue;
        });
    
        loop {
            let current_sensor = match all_sensors.try_next().await {
                Err(e) => { log::error!("Failed to poll stream of all sensors... {e}"); break; },
                Ok(None) => { log::trace!("Reached end of all sensors stream."); break; },
                Ok(Some(current_sensor)) => current_sensor
            };
            let existing_alerts = elevate!(mongodb_apis.alerts_collection.find(doc! {
                "$and": [
                    doc! { "sensorId": current_sensor.id.clone() },
                    doc! { "$and": [
                        doc! { "time": doc! { "$gte": current_datetime - trail_duration - alert_proximity } },
                        doc! { "time": doc! { "$lte": current_datetime } },
                    ]}
                ]
            }, None).await, e, {
                log::error!("Failed to query existing alerts for a sensor... {e}");
                continue;
            }); 
            let mut existing_alerts: Vec<_> = elevate!(existing_alerts.try_collect().await, e, {
                log::error!("Could not collect already queried existing alerts... {e}");
                continue;
            });

            for alert_definition in current_sensor.alert_definitions {
                // TODO: Do full on startup then do delta 
                let mut breaching_readings = elevate!(mongodb_apis.readings_collection.find(doc! { 
                    "$and": [
                        doc! { "sensorId": current_sensor.id.clone() },
                        doc! { "$or": [
                            doc! { "data": doc! { "$gte": alert_definition.hi_limit } },
                            doc! { "data": doc! { "$lte": alert_definition.lo_limit } },
                        ]},
                        doc! { "$and": [
                            doc! { "time": doc! { "$gte": current_datetime - trail_duration } },
                            doc! { "time": doc! { "$lte": current_datetime } },
                        ]}
                    ]
                }, None).await, e, {
                    log::error!("Failed to query breaching readings of a sensor... {e}");
                    continue;
                });

                loop {
                    let breaching_reading = match breaching_readings.try_next().await {
                        Err(e) => { log::error!("Failed to poll stream of sensor readings from database... {e}"); break; },
                        Ok(None) => { log::trace!("Reached end of sensor readings that breach the conditions stream."); break },
                        Ok(Some(breaching_reading)) => breaching_reading
                    };

                    let is_too_close = existing_alerts.iter().any(|existing_alert| {
                        breaching_reading.time >= (existing_alert.time.to_chrono() - alert_proximity).into()
                        && breaching_reading.time <= (existing_alert.time.to_chrono() + alert_proximity).into()
                    });
                    if is_too_close == true {
                        log::info!("An alert already exists close to the breaching reading.");
                        continue; 
                    } 

                    let sensor_alert = Alert::from_alert_definition(
                        &None,
                        &alert_definition,
                        &current_sensor.id,
                        &breaching_reading.time
                    );
                    let _ = elevate!(mongodb_apis.alerts_collection.insert_one(&sensor_alert, None).await, e, {
                        log::error!("Failed to insert alert into database... {e}");
                        continue;
                    });
                    log::info!("Create an alert.");
                    existing_alerts.push(sensor_alert);
                }
            }
        }
    } 
}

//
// Maintain one alert for one alert definition based on the most recent data in the past.
// The alert should exist when the sensor readings around the current datetime
// breach the thresholds.
// The alert should not exist when the sensor readings around the current datetime
// do not breach the thresholds. 
// Is open to leniency in behaviour:
// - If no readings, assume maintain previous alert state
// - For how long do readings have to be in threshold state before raising an alert
// - Smooting out jitter
//
// IMO this is seems most fitting right now, as:
// - With other approaches, why need historic alerts (or more than just the most recent)
// - Alerts are something computable given the sensor and sensor readings 
// - Frontend could even do the computation, though doing it here allows possibility for SNS, email, etc.
//
#[allow(dead_code)]
pub async fn approach_3(mongodb_apis: &mut MongoDbApis) -> anyhow::Result<()> {
    let mut readings_changes = mongodb_apis.readings_collection.watch(None, None).await
        .with_context(|| "Failed to initiate watching of the sensor readings collection")?;
    loop {
        let readings_change = match readings_changes.next().await.transpose() { 
            Err(e) => { log::error!("Encountered error when iterating over sensor readings changes... {e}"); continue },
            Ok(None) => { log::debug!("Encountered the end of the sensor readings changes stream"); continue }, 
            Ok(Some(x)) => x,
        };
        
        let sensor_reading = match (readings_change.operation_type, readings_change.full_document) {
            (mongodb::change_stream::event::OperationType::Insert, Some(x)) => x,    
            (_, _) => { log::trace!("Skipping change event as it is not of interest"); continue }
        };

        let now = chrono::Utc::now();
        let tail_length = std::time::Duration::from_secs(60 * 60);
        if sensor_reading.time.to_chrono() < (now - tail_length)
        || sensor_reading.time.to_chrono() > now {
            log::info!("Received sensor reading that has an odd time, not handling");
            continue; 
        }
        
        let between_readings = match mongodb_apis.readings_collection.find(
            doc! {
                "$and": [
                    doc! { "sensorId": sensor_reading.sensor_id.clone() },
                    doc! { "$and": [
                        doc! { "time": doc! { "$gte": now - tail_length } },
                        doc! { "time": doc! { "$lte": now } },
                    ]}
                ]
            }, 
            mongodb::options::FindOptions::builder().sort(doc! { "time": -1 }).build()
        ).await {
            Err(e) => { log::error!("Encountered error in querying sensor readings... {e}"); continue },
            Ok(x) => x  
        };
        let mut between_readings: Vec<_> = match between_readings.try_collect().await {
            Err(e) => { log::error!("Encountered error when collecting queried sensor readings... {e}"); continue },
            Ok(x) => x
        };
        between_readings.push(sensor_reading); 
        between_readings.sort_by(|x, y| y.time.cmp(&x.time));
        
        let recent_reading = match between_readings.iter().next() {
            None => { log::warn!("Not sensor readings (inclusively) between change event insert time and now"); continue },
            Some(x) => x
        };
        
        let source_sensor = match mongodb_apis.sensor_collection.find_one(doc! { "_id": recent_reading.sensor_id }, None).await {
            Err(e) => { log::error!("Encountered error when searching for sensor corresponding to the reading... {e}"); continue },
            Ok(None) => { log::warn!("Corresponding sensor could not be found for reading"); continue },
            Ok(Some(x)) => x
        };

        for alert_definition in source_sensor.alert_definitions {
            if recent_reading.data < alert_definition.lo_limit 
            || recent_reading.data > alert_definition.hi_limit {
                // TODO: Need model to allow mapping alert back to the alert definition
                // Do not delete, dismiss
                let mut recent_alert = match mongodb_apis.alerts_collection.find(
                    doc! { "sensorId": source_sensor.id }, 
                    mongodb::options::FindOptions::builder().sort(doc! { "time": -1 }).limit(1).build()
                ).await {
                    Err(e) => { log::error!("Encountered error when attempting to find most recent alert... {e}"); continue },
                    Ok(x) => x
                };
                let alert_id = match recent_alert.next().await.transpose() {
                    Err(e) => { log::error!("Encountered error when polling alert stream... {e}"); continue },
                    Ok(None) => None,
                    Ok(Some(x)) => Some(x.id)
                };
                let new_alert = match Alert::from_alert_definition(&alert_id, &alert_definition, &source_sensor.id, &recent_reading.time)
                    .as_doc_without_id() {
                    Err(e) => { log::error!("Encountered error when converting alert struct into document w/o _id... {e}"); continue },
                    Ok(x) => x
                };
                match mongodb_apis.alerts_collection.update_one(
                    doc! { "_id": alert_id.unwrap_or_else(|| mongodb::bson::oid::ObjectId::default()) }, 
                    doc! { "$set": new_alert },
                    mongodb::options::UpdateOptions::builder().upsert(true).build()
                ).await {
                    Err(e) => { log::error!("Encountered error when attempting to update alert... {e}"); continue },
                    Ok(_) => { log::trace!("Have upserted an alert"); continue }
                };
            } 
        } 
    }
}
