import express from "express";
import {streamImmediate, streamTimeSeries} from '../controllers/readings.controllers';

const router = express.Router();

router.get('/stream-immediate', streamImmediate);
router.get('/stream-timeseries/:sensorId/:scope', streamTimeSeries);

export default router;
