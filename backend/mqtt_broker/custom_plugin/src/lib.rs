//
// This is code to create a plugin for mosquitto.
// The beginnings of this is here as it proofs the possiblility to have further customization if needed.
//
// What is mosquitto?
// "Eclipse Mosquitto is an open source (EPL/EDL licensed) message broker that implements the MQTT protocol versions 5.0, 3.1.1 and 3.1" - https://mosquitto.org/
//
// It turns out that MQTT is a protocol that does not actually entail authorization against topics.
// I think certain implementation tack on additional features, such as access control lists, to their broker implementation.
//
#![allow(clippy::not_unsafe_ptr_arg_deref)]

use std::thread;
use axum::{routing::get, Router};
use mosquitto_plugin::*;

#[derive(Debug)]
pub struct MqttBroker {
    i: i32,
    s: String,
}

impl MosquittoPlugin for MqttBroker {
    //
    // TODO: init should be falliable.
    // What happends when a plugin fails to load
    //
    fn init(opts: std::collections::HashMap<&str, &str>) -> Self {
        // These are the strings provided after "auth_opt_<key> value" in the mosquitto.conf
        let default = "hej";
        let topic = opts.get("topic").unwrap_or(&default);
        let level = opts.get("level").unwrap_or(&default);
        let level = level.parse().unwrap_or(0);
        let _ = thread::spawn(move || {
            let _ = tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build()
                .unwrap()
                .block_on(async {
                    // TODO: Pinning
                    let app = Router::new().route("/", get(|| async { "hi" }));
                    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
                    axum::serve(listener, app).await.unwrap()
                });
        });

        MqttBroker {
            i: level,
            s: topic.to_string(),
        }
    }

    fn username_password(
        &mut self,
        client: &dyn MosquittoClientContext,
        u: Option<&str>,
        p: Option<&str>,
    ) -> Result<Success, Error> {
        let client_id = client.get_id().unwrap_or_else(|| "unknown".into());
        mosquitto_debug!("USERNAME_PASSWORD({}) {:?} - {:?}", client_id, u, p);
        if u.is_none() || p.is_none() {
            return Err(Error::Auth);
        }
        let u = u.unwrap();
        let p = p.unwrap();
        // this will allow all username/password where the password is the username in reverse
        let rp: String = p.chars().rev().collect();
        if rp == u {
            // Declare the accepted new client
            mosquitto_calls::publish_broadcast(
                "new_client",
                "very_client is a friend. Lets make it feel at home!".as_bytes(),
                QOS::AtMostOnce,
                false,
            )?;
            // Welcome the new client privately
            mosquitto_calls::publish_to_client(
                &client_id,
                "greeting",
                format!("Welcome {}", client_id).as_bytes(),
                QOS::AtMostOnce,
                false,
            )?;
            Ok(Success)
        } else {
            mosquitto_warn!("USERNAME_PASSWORD failed for {}", client_id);
            // Snitch to all other clients what a bad client that was.
            mosquitto_calls::publish_broadcast(
                "snitcheroo",
                format!("{} is a bad bad client. No cookies for it.", client_id).as_bytes(),
                QOS::AtMostOnce,
                false,
            )?;
            Err(Error::Auth)
        }
    }

    fn acl_check(
        &mut self,
        _client: &dyn MosquittoClientContext,
        level: AclCheckAccessLevel,
        msg: MosquittoMessage,
    ) -> Result<Success, mosquitto_plugin::Error> {
        mosquitto_debug!("allowed topic: {}", self.s);
        mosquitto_debug!("topic: {}", msg.topic);
        mosquitto_debug!("level requested: {}", level);

        // only the topic provided in the mosquitto.conf by the value auth_opt_topic <value> is
        // allowed, errors will not be reported to the clients though, they will only not be able
        // to send/receive messages and thus silently fail due to limitations in MQTT protocol
        if msg.topic == self.s {
            Ok(Success)
        } else {
            Err(Error::AclDenied)
        }
    }

    fn on_disconnect(&mut self, client: &dyn MosquittoClientContext, _reason: i32) {
        mosquitto_info!(
            "Plugin on_disconnect, Client {:?} is disconnecting",
            client.get_id()
        );
    }

    fn on_message(&mut self, client: &dyn MosquittoClientContext, message: MosquittoMessage) {
        mosquitto_info!(
            "Plugin on_message: client {:?}: Topic: {}, Payload: {:?}",
            client.get_id(),
            message.topic,
            message.payload
        )
    }
}

create_dynamic_library!(MqttBroker);
