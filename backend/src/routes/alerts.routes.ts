import express from "express";
import {
    watchAllAlerts, 
    watchSensorAlerts, 
    addSensorAlertConfiguration,
    changeSensorAlertConfiguration,
    getSensorAlertConfigurations,
    deleteSensorAlertConfiguration
} from '../controllers/alerts.controllers';

const router = express.Router();

router.get('/', watchAllAlerts);

router.get('/:sensorId', watchSensorAlerts);

router.get('/config/:sensorId', getSensorAlertConfigurations);

router.post('/config/:sensorId', addSensorAlertConfiguration);

router.put('/config/:sensorId', changeSensorAlertConfiguration)

router.delete('/config/:sensorId', deleteSensorAlertConfiguration)

export default router;
