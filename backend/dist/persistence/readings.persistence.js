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
exports.readTimeSeriesReadings = exports.readImmediateReadings = void 0;
const readings_model_1 = require("../models/readings.model");
/**
 * Fetches immediate sensor readings from the database within the specified time range.
 *
 * @param startTime - The start time from which to fetch sensor readings.
 * @param endTime - The end time until which to fetch sensor readings.
 * @returns An array of SensorReading documents.
 */
const readImmediateReadings = (startTime, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    // Filter to fetch sensor readings within the specified time range
    const filter = {
        time: { $gte: startTime, $lt: endTime }
    };
    return yield readings_model_1.SensorReadingModel.find(filter).exec();
});
exports.readImmediateReadings = readImmediateReadings;
/**
 * Connection to database that returns all sensor readings from 'scope' period of time
 * until now
 *
 * @sensorId: the UUID for the sensor whose data is being requested
 * @param: a string indicating the scope either hour, day or week
 *
 * @return: array of SensorReading documents
 */
const readTimeSeriesReadings = (sensorId, scope) => __awaiter(void 0, void 0, void 0, function* () {
    // calculate the times for the scope:
    const now = new Date();
    const MS_PER_S = 1000;
    const MS_IN_MIN = MS_PER_S * 60;
    // assume hourly scope unless otherwise specified
    let scopeDurationMS = MS_IN_MIN * 60;
    switch (scope) {
        case 'day':
            scopeDurationMS = scopeDurationMS * 24;
            break;
        case 'week':
            scopeDurationMS = scopeDurationMS * 7;
            break;
    }
    // find start and end times for time series
    const excessTimeFromCurrMinute = now.getMilliseconds() + now.getSeconds() * MS_PER_S;
    const currMinute = now.valueOf() - excessTimeFromCurrMinute.valueOf();
    const startTime = now.valueOf() - scopeDurationMS;
    // filter out all records not within the specified scope
    const filter = {
        sensorId: sensorId,
        time: {
            $gte: new Date(startTime), $lt: new Date(currMinute + MS_IN_MIN)
        }
    };
    return yield readings_model_1.SensorReadingModel.find(filter).exec();
});
exports.readTimeSeriesReadings = readTimeSeriesReadings;
