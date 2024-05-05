import express from "express";
import {
    watchAllAlerts, 
    watchSensorAlerts, 
    addSensorAlertConfiguration,
    changeSensorAlertConfiguration
} from '../controllers/alerts.controllers';

const router = express.Router();

router.get('/', watchAllAlerts);

router.get('/:sensorId', watchSensorAlerts);

router.post('/:sensorId', addSensorAlertConfiguration);

router.put('/:sensorId', changeSensorAlertConfiguration)

export default router;
