import express from "express";
import {streamImmediate} from '../controllers/readings.controllers';
import {getTimeseries} from "../controllers/timeseries.controllers";

const router = express.Router();

router.get('/stream-immediate', streamImmediate);
router.get('/stream-timeseries/:sensorId/:scope', getTimeseries);

export default router;
