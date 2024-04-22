use rumqttc::{Packet, Client, Event, Incoming, MqttOptions, QoS};
use std::thread;
use std::time::Duration;

fn main() {
    let mut mqttoptions = MqttOptions::new("test-1", "localhost", 1883);
    mqttoptions
        .set_keep_alive(Duration::from_secs(5));

    let (mut client, mut connection) = Client::new(mqttoptions, 10);
    client.subscribe("temperature", QoS::ExactlyOnce).unwrap();

    for event in connection.iter() {
        if let Ok(Event::Incoming(Packet::Publish(payload))) = event {
            println!("{:?}", payload.payload);
        }
    }
}

