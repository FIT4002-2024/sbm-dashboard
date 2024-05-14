"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamTimeSeries = exports.streamImmediate = void 0;
const readings_persistence_1 = require("../persistence/readings.persistence");
/**
 * Implements a server-sent event (SSE) endpoint to simulate the streaming of sensor readings stored in the database.
 * This approach simulates real-time updates by cyclically sending existing database entries as if they are arriving live.
 * Additionally, sends the first reading immediately upon connection.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
const streamImmediate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    // Define the static time range for the demo
    const startTime = new Date("2024-04-16T16:22:00Z"); // Start a bit before the first data point
    const endTime = new Date("2024-04-16T16:29:00Z"); // End a bit after the last data point
    let currentTime = new Date(startTime); // Initialise the current time to the start time
    try {
        // Fetch the latest sensor readings immediately upon connection
        const latestReadings = yield (0, readings_persistence_1.readImmediateReadings)(currentTime, endTime);
        if (latestReadings.length > 0) {
            // Send the latest readings to the client
            res.write(`data: ${JSON.stringify(latestReadings)}\n\n`);
        }
        else {
            // If no data available, send a message indicating so
            res.write(': No data available\n\n');
        }
    }
    catch (error) {
        console.error('Error fetching sensor readings:', error);
        res.status(500).send("Failed to fetch data");
        return;
    }
    // Function to fetch all sensor readings from the database within the specified time range
    const fetchSensorReadings = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, readings_persistence_1.readImmediateReadings)(currentTime, endTime); // Pass both startTime and endTime
        }
        catch (error) {
            console.error('Error fetching sensor readings:', error);
            return []; // Return an empty array in case of error
        }
    });
    // Fetch all readings once and cycle through them
    const allReadings = yield fetchSensorReadings();
    // Object to store the index of the next reading for each sensorId
    const nextReadingIndex = {};
    // Initialize nextReadingIndex with 0 for each sensorId
    allReadings.forEach((reading) => {
        if (!nextReadingIndex[reading.sensorId]) {
            nextReadingIndex[reading.sensorId] = 0;
        }
    });
    // Function to periodically send data
    const intervalId = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        if (allReadings.length > 0) {
            // Iterate over each sensorId and send the next reading
            for (const sensorId in nextReadingIndex) {
                const index = nextReadingIndex[sensorId];
                const readingsForSensor = allReadings.filter((reading) => reading.sensorId === sensorId);
                if (index < readingsForSensor.length) {
                    const reading = readingsForSensor[index];
                    res.write(`data: ${JSON.stringify([reading])}\n\n`); // Send the reading
                    nextReadingIndex[sensorId] = (index + 1) % readingsForSensor.length; // Update the index
                }
            }
        }
        else {
            res.write(': No data available\n\n');
        }
        // Increment currTime by 10 seconds
        currentTime = new Date(currentTime.getTime() + 10000);
        console.log(currentTime);
        // Check if currTime has exceeded endTime, and end fetching if it has
        if (currentTime >= new Date(startTime.getTime() + 60 * 1000)) {
            clearInterval(intervalId); // Clear the interval
            res.end(); // End the response
            console.log('Stopped sending events as endTime reached');
            return;
        }
    }), 10000); // Send data every 10 seconds
    // Clean up when client closes connection
    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
        console.log('Stopped sending events as client closed the connection');
    });
});
exports.streamImmediate = streamImmediate;
/**
 * Implements a server-sent event where it constantly streams the specified sensors readings
 * for the past x units of time where x is the scope e.g. daily, weekly and returns it to the
 * client as long as the connection remains open
 *
 * Taken from https://stackoverflow.com/a/67184841
 *
 * @param req
 * @param res
 */
const streamTimeSeries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sensorId, scope } = req.params;
    if (!['hour', 'day', 'week'].includes(scope)) {
        return res.status(400).json({ error: 'Invalid scope: must be one of hour, day, week.' });
    }
    // open stream
    res.writeHead(200, {
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream"
    });
    // initial stream so client doesn't have to wait for 60 seconds
    const readings = yield (0, readings_persistence_1.readTimeSeriesReadings)(sensorId, scope);
    res.write(`data: ${JSON.stringify(readings)}\n\n`);
    // stream data every 60 seconds
    const MS_IN_S = 1000;
    const stream = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const readings = yield (0, readings_persistence_1.readTimeSeriesReadings)(sensorId, scope);
        res.write(`data: ${JSON.stringify(readings)}\n\n`);
    }), 60 * MS_IN_S);
    // close stream when connections ends and stop the interval
    res.on('close', () => {
        clearInterval(stream);
        res.end();
    });
});
exports.streamTimeSeries = streamTimeSeries;
