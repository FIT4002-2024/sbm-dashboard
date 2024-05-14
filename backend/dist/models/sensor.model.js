"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SensorSchema = new mongoose_1.Schema({
    name: String,
    type: String,
    location: String
});
SensorSchema.index({ name: 1, location: 1 }, { unique: true });
const SensorModel = (0, mongoose_1.model)('Sensor', SensorSchema, 'Sensors');
exports.default = SensorModel;
