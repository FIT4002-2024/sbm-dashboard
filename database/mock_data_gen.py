#!/usr/bin/python

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime, timedelta
from random import randint
from uuid import uuid4
import argparse

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
parser.add_argument('-s', '--start_scope', default='hour', choices=['hour', 'day', 'week'], type=str, help="Should the script create data for the past hour, day or week?")
parser.add_argument('-e', '--end_scope', default='hour', choices=['hour', 'day', 'week', 'month'], type=str, help="Should the script create data for the next hour, day, week or months?")

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
    "_id": {"$oid": uuid4().hex},
    "name": sensor_names[i],
    "type": list(sensor_types.keys())[i%2],
    "location": sensor_locations[randint(0, 5)],
    "__v": 0
} for i in range(9)]

###########################################
###       readings data creation        ###
###########################################

sensor_readings = []

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
for sensor in sensors:
    current_date = start_date

    while current_date <= end_date:    
        sensor_readings.append({
            "_id": {"$oid": uuid4().hex},
            "time": current_date,
            "type": sensor['type'],
            "sensorId": sensor['_id'],
            "units": sensor_types[sensor['type']],
            "data": randint(10, 60),
            "__v": 0
        })

        current_date += timedelta(minutes=1)

###########################################
###         database population         ###
###########################################

uri = 'mongodb://' + args.host + ':' + args.port
client = MongoClient(uri)

db = client[args.name]

# if collections exist, drop them all

if db.SensorReadings is not None:
    db.SensorReadings.drop()

if db.Sensors is not None:
    db.Sensors.drop()

# create the collections

# populate the collections with data

