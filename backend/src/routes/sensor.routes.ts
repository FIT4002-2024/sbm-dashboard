import express from "express";
import {streamTimeseries} from '../controllers/timeseries.controllers';

const router = express.Router();

router.get('/stream', streamTimeseries);

export default router;
