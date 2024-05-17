import os 
import sys
import time
import json
from random import randint
from datetime import datetime, timedelta, timezone
import paho.mqtt.client as mqtt

if sys.argv[1] is None or sys.argv[1].isspace():
    os.exit(1)

if sys.argv[2] is None or sys.argv[2].isspace() or not sys.argv[2].isdigit():
    os.exit(1)
sys.argv[2] = int(sys.argv[2])

mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, "fake-sensor")
mqtt_client.username_pw_set("test-user", "test-password")
def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected with result code: {reason_code}")
mqtt_client.on_connect = on_connect
def on_publish(client, userdata, mid, reason_code, properties):
    print(f"Published with result code: {reason_code}")
mqtt_client.on_publish = on_publish 

mqtt_client.connect("localhost", 1885, 60)

mqtt_client.loop_start()

while True:
    time.sleep(sys.argv[2])

    mqtt_client.publish(
        "ibm/temperature", 
        json.dumps({
            # "time": datetime.now(timezone.utc).isoformat(),
            "time": {
                "$date": datetime.now(timezone.utc).isoformat()
            },
            "type": "info",
            "sensorId": sys.argv[1],
            "units": "°C",
            "data": randint(1, 100) 
        })        
    )

mqtt_client.loop_stop()
