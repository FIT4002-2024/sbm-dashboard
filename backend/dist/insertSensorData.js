"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const readings_model_1 = require("./models/readings.model");
dotenv_1.default.config({ path: '../.env' });
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);
const mongoURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
mongoose_1.default
    .connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Sample data array
const mockData = [
    { time: new Date("2024-04-16T16:23:10Z"), type: "humidity", sensorId: "HALFKJN", units: "gpk", data: 56 },
    { time: new Date("2024-04-16T16:24:10Z"), type: "humidity", sensorId: "HALFKJN", units: "gpk", data: 57 },
    { time: new Date("2024-04-16T16:25:10Z"), type: "humidity", sensorId: "HALFKJN", units: "gpk", data: 58 },
    { time: new Date("2024-04-16T16:26:10Z"), type: "humidity", sensorId: "HALFKJN", units: "gpk", data: 59 },
    { time: new Date("2024-04-16T16:27:10Z"), type: "humidity", sensorId: "HALFKJN", units: "gpk", data: 60 },
    { time: new Date("2024-04-16T16:28:10Z"), type: "humidity", sensorId: "HALFKJN", units: "gpk", data: 61 },
    { time: new Date("2024-04-16T16:23:10Z"), type: "temperature", sensorId: "TEMP001", units: "°C", data: 23 },
    { time: new Date("2024-04-16T16:24:10Z"), type: "temperature", sensorId: "TEMP001", units: "°C", data: 24 },
    { time: new Date("2024-04-16T16:25:10Z"), type: "temperature", sensorId: "TEMP001", units: "°C", data: 25 },
    { time: new Date("2024-04-16T16:26:10Z"), type: "temperature", sensorId: "TEMP001", units: "°C", data: 26 },
    { time: new Date("2024-04-16T16:27:10Z"), type: "temperature", sensorId: "TEMP001", units: "°C", data: 27 },
    { time: new Date("2024-04-16T16:28:10Z"), type: "temperature", sensorId: "TEMP001", units: "°C", data: 28 },
    { time: new Date("2024-04-16T16:23:10Z"), type: "temperature", sensorId: "TEMP002", units: "°C", data: 19 },
    { time: new Date("2024-04-16T16:24:10Z"), type: "temperature", sensorId: "TEMP002", units: "°C", data: 20 },
    { time: new Date("2024-04-16T16:25:10Z"), type: "temperature", sensorId: "TEMP002", units: "°C", data: 21 },
    { time: new Date("2024-04-16T16:26:10Z"), type: "temperature", sensorId: "TEMP002", units: "°C", data: 22 },
    { time: new Date("2024-04-16T16:27:10Z"), type: "temperature", sensorId: "TEMP002", units: "°C", data: 23 },
    { time: new Date("2024-04-16T16:28:10Z"), type: "temperature", sensorId: "TEMP002", units: "°C", data: 24 },
    { time: new Date("2024-04-16T16:23:10Z"), type: "humidity", sensorId: "HMDTY02", units: "gpk", data: 50 },
    { time: new Date("2024-04-16T16:24:10Z"), type: "humidity", sensorId: "HMDTY02", units: "gpk", data: 52 },
    { time: new Date("2024-04-16T16:25:10Z"), type: "humidity", sensorId: "HMDTY02", units: "gpk", data: 54 },
    { time: new Date("2024-04-16T16:26:10Z"), type: "humidity", sensorId: "HMDTY02", units: "gpk", data: 56 },
    { time: new Date("2024-04-16T16:27:10Z"), type: "humidity", sensorId: "HMDTY02", units: "gpk", data: 58 },
    { time: new Date("2024-04-16T16:28:10Z"), type: "humidity", sensorId: "HMDTY02", units: "gpk", data: 60 }
];
// Insert data into MongoDB using the SensorReadingModel
readings_model_1.SensorReadingModel.insertMany(mockData)
    .then(() => {
    console.log('Data inserted successfully');
    return mongoose_1.default.disconnect(); // Close the connection after successful insertion
})
    .catch((err) => {
    console.error('Error inserting data:', err);
    return mongoose_1.default.disconnect(); // Close the connection if there is an error
});
