mod database;
mod poc_approaches;

use clap::Parser;

#[derive(Parser, Debug)]
struct ProgramParameters {
    #[arg(long = "mongo-uri", default_value_t = String::from("mongodb://initial_primary:27017/sbm_dashboard?replicaSet=sbm"))]
    mongo_connection_string: String,
}

//
// A bare minimum program to create alerts from alert definitions.
//
// TODO: Consider updating program to allow for more than one process to handle alerts, in some ways this is just a 
//
// Buffer min of ... worth of alerts or <some time> period
//
#[tokio::main()]
async fn main() -> anyhow::Result<()> {
    env_logger::init();
    let program_arguments = ProgramParameters::parse();
    let mut mongodb_apis = database::MongoDbApis::try_new(&program_arguments.mongo_connection_string).await?;
    // let _ = poc_approaches::approach_1(&mut mongodb_apis).await;    
    // let _ = poc_approaches::approach_2(&mut mongodb_apis).await;    
    let _ = poc_approaches::approach_3(&mut mongodb_apis).await;    
    Ok(())
}
