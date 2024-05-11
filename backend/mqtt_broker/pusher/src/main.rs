use std::time::Duration;
use log;
use anyhow::{Result, Context};
use clap::Parser;
use rumqttc::{MqttOptions, AsyncClient, QoS, Event, Incoming};
use mongodb::{Client, options::ClientOptions};

macro_rules! elevate {
    ($to_match: expr, $e: pat, $on_error: expr) => {
        match $to_match {
            Ok(o) => o,
            Err($e) => $on_error
        }
    };
}

#[derive(Parser, Debug)]
struct ProgramParameters {
    #[arg(short = 'c', long, default_value_t = String::from("pushert"))]
    mqtt_client_id: String,
    #[arg(short = 'b', long, default_value_t = String::from("localhost"))]
    mqtt_broker_hostname: String,
    #[arg(long = "port", default_value_t = 1885)]
    mqtt_broker_port: u16,

    #[arg(short = 'u', long, default_value_t = String::from("test-user"))]
    mqtt_username: String,
    #[arg(short = 'p', long, default_value_t = String::from("test-password"))]
    mqtt_password: String,

    #[arg(short = 't', long, default_value_t = String::from("ibm"))]
    tenant_id: String,
    
    #[arg(long = "mongo-uri", default_value_t = String::from("mongodb://localhost:27017,localhost:27018,localhost:27019/sbm_dashboard"))]
    mongo_connection_string: String,
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<()> {
    env_logger::init();
    let program_arguments = ProgramParameters::parse();

    let mut mqtt_options = MqttOptions::new(program_arguments.mqtt_client_id, program_arguments.mqtt_broker_hostname, program_arguments.mqtt_broker_port);
    mqtt_options.set_credentials(program_arguments.mqtt_username, program_arguments.mqtt_password);
    mqtt_options.set_keep_alive(Duration::from_secs(5));

    let (mqtt_client, mut eventloop) = AsyncClient::new(mqtt_options, 10);
    mqtt_client.subscribe(format!("{}/temperature", program_arguments.tenant_id), QoS::ExactlyOnce).await
        .with_context(|| "Failed to subscribe to MQTT topic")?;

    let mongo_options = ClientOptions::parse(program_arguments.mongo_connection_string).await
        .with_context(|| "Failed to parse MongoDB connection string")?;
    let mongo_client = Client::with_options(mongo_options)
        .with_context(|| "Failed to init MongoDB client")?;
    let readings_collection = mongo_client.default_database()
        .with_context(|| "Did not specify default database")?
        .collection::<SensorReading>("SensorReadings");

    loop {
        let broad_event = elevate!(eventloop.poll().await, e, {
            log::error!("Polling eventloop failed... {}", e); 
            continue;
        });
        let subscribed_message = match broad_event {
            Event::Incoming(Incoming::Publish(subscribed_message)) => subscribed_message,
            broad_event => {
                log::debug!("Discarding MQTT event... {:?}", broad_event);
                continue;
            }
        };
        
        let sensor_reading: SensorReading = elevate!(
            serde_json::from_slice(subscribed_message.payload.as_ref()), e, { 
                log::warn!("Could not serialize sensor reading... {}", e); 
                continue;
            }
        );
        let _ = elevate!(readings_collection.insert_one(sensor_reading, None).await, e, {
            log::error!("Could not insert sensor reading into database... {}", e); 
            continue;
        });

        log::debug!("Successfully reached end of loop");
    };
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SensorReading {
    #[serde(rename = "_id", default = "mongodb::bson::oid::ObjectId::new")]
    pub id: mongodb::bson::oid::ObjectId,
    #[serde(with = "mongodb::bson::serde_helpers::bson_datetime_as_rfc3339_string")]
    pub time: mongodb::bson::DateTime,
    #[serde(rename = "type")]
    pub type_: String, 
    pub sensor_id: mongodb::bson::oid::ObjectId,
    pub units: String,
    pub data: f32 
}
