#!/usr/bin/python

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime, timedelta
from random import randint
from uuid import uuid4
from bson import ObjectId
import argparse
import random

###########################################
###    command line input validation    ###
###########################################
parser = argparse.ArgumentParser(
    prog="mock_data_gen.py",
    usage="python mock_data_gen.py [--port | -p] PORT_NUM [--host | -H] DB_HOST [--name | -N] DB_NAME",
    description="Connect to a MongoDB database and populate it with sample smb_dashboard data.\n" + 
                "Defaults to 127.0.0.1:27107 with name sbm_dashboard if no args supplied.\n" + 
                "Each time you run, it will delete all existing data in your database before repopulating."
)

parser.add_argument('-p', '--port', default='27017', type=str, help="The port number of the database.")
parser.add_argument('-H', '--host', default='127.0.0.1', type=str, help="The URL for the DB. If localhost, put 127.0.0.1.")
parser.add_argument('-n', '--name', default='sbm_dashboard', type=str, help="The name of the dashboard")
parser.add_argument('-g', '--grain', default=60, type=int, choices=[10, 30, 60], help="The granularity of readings entries e.g. do we have readings per minute or per 10sec?")
parser.add_argument('-s', '--start_scope', default='week', choices=['hour', 'day', 'week'], type=str, help="Should the script create data for the past hour, day or week?")
parser.add_argument('-e', '--end_scope', default='week', choices=['hour', 'day', 'week', 'month'], type=str, help="Should the script create data for the next hour, day, week or months?")
parser.add_argument('-o', '--only_sensors', type=bool, default=False, help="Whether to only generate sensors")

args = parser.parse_args()

###########################################
###        sensor data creation         ###
###########################################

sensor_names = [
    'RPi-068',       'Jetson-Nano-1', 'VLP-16', 
    'Jim',           'Arduino-6',     'RPi-070',
    'Jetson-Nano-2', 'Origin-5',      'XXIV-9'    
]

sensor_locations = [
    'loading dock', 'freezer room', 'reception', 
    'west bay',     'east bay',     'basement'  
]

sensor_types = {'temperature': 'C', 'humidity': 'g/m3'}

sensors = [{
    "_id": ObjectId(''.join([random.choice('0123456789abcdef') for i in range(24)])),
    "name": sensor_names[i],
    "type": list(sensor_types.keys())[i%2],
    "location": sensor_locations[randint(0, 5)],
    "alertDefinitions": [{
        "loLimit": randint(1, 50),
        "hiLimit": randint(51, 100),
        "type": "info",
        "msg": "teemo",
        "fix": "mush"
    }],
    "__v": 0
} for i in range(9)]

###########################################
###  readings and alert data creation   ###
###########################################

sensor_readings = []
alerts = []

alert_msgs = [
    {
        "type": "info",
        "msg": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "fix": "Sed do eiusmod tempor incididunt"
    },
    {
        "type": "warning",
        "msg": "Ut labore et dolore magna aliqua",
        "fix": "Ut enim ad minim veniam"
    },
    {
        "type": "critical",
        "msg": "Quis nostrud exercitation ullamco laboris nisi ut aliquip",
        "fix": "Ex ea commodo consequat"
    }
]

# determine how far back and forward we want to generate mock readings for
start_time, end_time = 1, 1

if args.start_scope == 'day':
    start_time = start_time * 24
elif args.start_scope == 'week':
    start_time = start_time * 24 * 7

if args.end_scope == 'day':
    end_time = end_time * 24
elif args.end_scope == 'week':
    end_time = end_time * 24 * 7
elif args.end_scope == 'month':
    end_time = end_time * 24 * 7 * 30

start_date = datetime.now() - timedelta(hours=start_time)
end_date = datetime.now() + timedelta(hours=end_time)


# generate mock readings for every minute within the scope per sensor
if not args.only_sensors:
    for sensor in sensors:
        current_date = start_date

        while current_date <= end_date:
            rng = randint(1, 100)
            sensor_readings.append({
                # "_id": ObjectId(''.join([random.choice('0123456789abcdef') for i in range(24)])),
                "time": current_date,
                "type": sensor['type'],
                "sensorId": sensor['_id'],
                "units": sensor_types[sensor['type']],
                "data": rng,
                "__v": 0
            })

            if rng >= 10:
                alert_msg = alert_msgs[rng%3]
                alerts.append({
                    # "_id": ObjectId(''.join([random.choice('0123456789abcdef') for i in range(24)])),
                    "time": current_date,
                    "type": alert_msg['type'],
                    "sensorId": sensor['_id'],
                    "msg": alert_msg['msg'],
                    "fix": alert_msg['fix'],
                    "__v": 0
                })

            current_date += timedelta(seconds=args.grain)

###########################################
###         database population         ###
###########################################

uri = 'mongodb://' + args.host + ':' + args.port
client = MongoClient(uri)

db = client[args.name]

# if collections exist, drop them all and re-create them with re-populated data
# TODO don't drop collection (might drop watch), just delete entries
if db.SensorReadings is not None:
    db.SensorReadings.drop()

if db.Alerts is not None:
    db.Alerts.drop()

if db.Sensors is not None:
    db.Sensors.drop()

db.create_collection('Sensors')
db.create_collection('SensorReadings')
db.create_collection('Alerts')

db['Sensors'].insert_many(sensors)
if not args.only_sensors:
    db['SensorReadings'].insert_many(sensor_readings)
    db['Alerts'].insert_many(alerts)
