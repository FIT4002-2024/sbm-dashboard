"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const readings_controllers_1 = require("../controllers/readings.controllers");
const cors_1 = __importDefault(require("cors")); // Import CORS module
const router = express_1.default.Router();
// Applying CORS to the specific route
// Configure CORS to allow requests from your specific frontend address
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only this origin to access
    optionsSuccessStatus: 200
};
router.get('/stream-immediate', (0, cors_1.default)(corsOptions), readings_controllers_1.streamImmediate);
router.get('/stream-timeseries/:sensorId/:scope', readings_controllers_1.streamTimeSeries);
exports.default = router;
