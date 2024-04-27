import express from 'express';
import { getTimeseries } from '../controllers/timeseries.controllers';

const router = express.Router();

router.get('/sensor/:sensorId/:scope', getTimeseries);

export default router;