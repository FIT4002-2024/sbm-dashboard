"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorReadingModel = void 0;
const mongoose_1 = require("mongoose");
const SensorReadingSchema = new mongoose_1.Schema({
    time: Date,
    type: String,
    sensorId: String,
    units: String,
    data: Number
});
exports.SensorReadingModel = (0, mongoose_1.model)('SensorReading', SensorReadingSchema, 'SensorReadings');
