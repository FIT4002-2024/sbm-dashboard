import express from "express";
import {streamImmediate, streamTimeSeries} from '../controllers/readings.controllers';
import cors from 'cors';  // Import CORS module

const router = express.Router();

// Applying CORS to the specific route
// Configure CORS to allow requests from your specific frontend address
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only this origin to access
    optionsSuccessStatus: 200
};

router.get('/stream-immediate', cors(corsOptions), streamImmediate);
router.get('/stream-timeseries/:sensorId/:scope', streamTimeSeries);

export default router;

