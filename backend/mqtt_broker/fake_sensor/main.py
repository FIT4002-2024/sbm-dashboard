import time
import paho.mqtt.client as mqtt

mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, "fake-sensor")
mqttc.username_pw_set("test-user", "test-password")
def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected with result code: {reason_code}")
mqttc.on_connect = on_connect
def on_publish(client, userdata, mid, reason_code, properties):
    print(f"Published with result code: {reason_code}")
mqttc.on_publish = on_publish 

mqttc.connect("localhost", 1885, 60)

mqttc.loop_start()

while True:
    mqttc.publish("ibm/temperature", "{"
        "\"time\": \"2012-04-23T18:25:43.511Z\","
        "\"type\": \"temperature\","
        "\"sensorId\": \"fake-sensor\","
        "\"units\": \"°C\","
        "\"data\": \"20\""
    "}")
    time.sleep(1)

mqttc.loop_stop()
