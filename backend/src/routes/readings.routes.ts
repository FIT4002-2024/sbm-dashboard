import express from "express";
import {streamImmediate, getTimeseries} from '../controllers/readings.controllers';

const router = express.Router();

router.get('/stream-immediate', streamImmediate);
router.get('/stream-timeseries/:sensorId/:scope', getTimeseries);

export default router;
