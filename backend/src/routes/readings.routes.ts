import express from "express";
import {streamImmediate} from '../controllers/readings.controllers';

const router = express.Router();

router.get('/stream-immediate', streamImmediate);

export default router;
