use std::time::Duration;
use log;
use anyhow::{Result, Context};
use clap::Parser;
use rumqttc::{MqttOptions, AsyncClient, QoS, Event, Incoming};
use mongodb::{Client, options::ClientOptions};

#[derive(Parser, Debug)]
struct ProgramParameters {
    #[arg(short = 'c', long, default_value_t = String::from("pushert"))]
    mqtt_client_id: String,
    #[arg(short = 'b', long, default_value_t = String::from("mqtt_broker"))]
    mqtt_broker_hostname: String,
    #[arg(long = "port", default_value_t = 1885)]
    mqtt_broker_port: u16,

    #[arg(short = 'u', long, default_value_t = String::from("test-user"))]
    mqtt_username: String,
    #[arg(short = 'p', long, default_value_t = String::from("test-password"))]
    mqtt_password: String,

    #[arg(short = 't', long, default_value_t = String::from("ibm"))]
    tenant_id: String,
    
    #[arg(long = "mongo-uri", default_value_t = String::from("mongodb://sbm_database_1:27017,sbm_database_2:27018,sbm_database_3:27019/sbm_dashboard?replicaSet=sbm"))]
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
        .collection::<database_client::SensorReading>("SensorReadings");

    loop {
        let broad_event = match eventloop.poll().await {
            Err(e) => { log::error!("Polling eventloop failed... {e}"); continue }, 
            Ok(x) => x 
        };

        let subscribed_message = match broad_event {
            Event::Incoming(Incoming::Publish(subscribed_message)) => subscribed_message,
            broad_event => {
                log::debug!("Discarding MQTT event... {:?}", broad_event);
                continue;
            }
        };
        
        let sensor_reading: database_client::SensorReading = match serde_json::from_slice(subscribed_message.payload.as_ref()) {
            Err(e) => { log::warn!("Could not serialize sensor reading... {e}"); continue }, 
            Ok(x) => x 
        }; 
        let _ = match readings_collection.insert_one(sensor_reading, None).await {
            Err(e) => { log::warn!("Could not insert sensor reading into database... {e}"); continue }, 
            Ok(x) => x 
        };

        log::trace!("Successfully reached end of loop");
    };
}
