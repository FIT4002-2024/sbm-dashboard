use anyhow::Context;
use mongodb::{Client, options::ClientOptions, bson::doc};

pub struct MongoDbApis {
    pub alerts_collection: mongodb::Collection<Alert>,      
    pub sensor_collection: mongodb::Collection<Sensor>, 
    pub readings_collection: mongodb::Collection<SensorReading>
}

impl MongoDbApis {
    pub async fn try_new(connection_string: &str) -> anyhow::Result<Self> {
        let mongo_options = ClientOptions::parse(connection_string).await
            .with_context(|| "Failed to parse MongoDB connection string")?;
        let mongo_client = Client::with_options(mongo_options)
            .with_context(|| "Failed to init MongoDB client")?;
        let mongo_database = mongo_client.default_database()
            .with_context(|| "Did not specify default database")?;
        
        Ok(Self {
            alerts_collection: mongo_database.collection::<Alert>("Alerts"),
            sensor_collection: mongo_database.collection::<Sensor>("Sensors"),
            readings_collection: mongo_database.collection::<SensorReading>("SensorReadings")
        })
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Sensor {
    #[serde(rename = "_id")]
    pub id: mongodb::bson::oid::ObjectId,
    pub name: String,
    #[serde(rename = "type")]
    pub type_: String,
    pub location: String,
    pub alert_definitions: Vec<AlertDefinition>
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlertDefinition {
    pub lo_limit: f32,
    pub hi_limit: f32,
    #[serde(rename = "type")]
    pub type_: String,
    pub msg: String,
    pub fix: String
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Alert {
    #[serde(rename = "_id")]
    pub id: mongodb::bson::oid::ObjectId,
    pub time: mongodb::bson::DateTime,
    #[serde(rename = "type")]
    pub type_: String,
    pub sensor_id: mongodb::bson::oid::ObjectId,
    pub msg: String,
    pub fix: String
}

impl Alert {
    pub fn from_alert_definition(alert_id: &Option<mongodb::bson::oid::ObjectId>, alert_definition: &AlertDefinition, sensor_id: &mongodb::bson::oid::ObjectId, breach_datetime: &mongodb::bson::DateTime) -> Self {
        Self {
            id: alert_id.unwrap_or_else(|| mongodb::bson::oid::ObjectId::default()).clone(),
            time: breach_datetime.clone(),
            type_: alert_definition.type_.clone(),
            sensor_id: sensor_id.clone(),
            msg: alert_definition.msg.clone(),
            fix: alert_definition.fix.clone()
        }
    }
    
    pub fn as_doc_without_id(&self) -> anyhow::Result<mongodb::bson::document::Document> {
        let mut as_document = mongodb::bson::to_document(self)?;
        let _ = as_document.remove("_id");
        Ok(as_document)
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SensorReading {
    #[serde(rename = "_id", default = "mongodb::bson::oid::ObjectId::new")]
    pub id: mongodb::bson::oid::ObjectId,
    // #[serde(with = "mongodb::bson::serde_helpers::bson_datetime_as_rfc3339_string")]
    pub time: mongodb::bson::DateTime,
    #[serde(rename = "type")]
    pub type_: String, 
    pub sensor_id: mongodb::bson::oid::ObjectId,
    pub units: String,
    pub data: f32 
}
