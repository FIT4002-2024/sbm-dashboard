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
    #[allow(unused_variables)]
    let readings_collection = mongo_client.default_database()
        .with_context(|| "Did not specify default database")?
        .collection::<database_client::SensorReading>("SensorReadings");

    #[allow(unreachable_code, unused_variables)]
    loop {
        let broad_event = eventloop.poll().await
            .inspect_err(|e| log::error!("Polling eventloop failed... {e}")).unwrap_or(continue);
        let subscribed_message = match broad_event {
            Event::Incoming(Incoming::Publish(subscribed_message)) => subscribed_message,
            broad_event => {
                log::debug!("Discarding MQTT event... {:?}", broad_event);
                continue;
            }
        };
        
        let sensor_reading: database_client::SensorReading = serde_json::from_slice(subscribed_message.payload.as_ref())
            .inspect_err(|e| log::warn!("Could not serialize sensor reading... {e}")).unwrap_or(continue);
        let _ = readings_collection.insert_one(sensor_reading, None).await
            .inspect_err(|e| log::warn!("Could not insert sensor reading into database... {e}")).unwrap_or(continue);

        log::trace!("Successfully reached end of loop");
    };
}
