import { Request, Response } from "express";
import {
    readAllSensorAlerts,
    readSingleSensorsAlerts,
    readSensorAlertConfigurations,
    addSensorAlertConfiguration as addConfiguration,
    changeSensorAlertConfiguration as changeConfiguration,
    deleteSensorAlertConfiguration as deleteConfiguration
} from '../persistence/alerts.persistence'

/**
 * Implements a server-sent event (SSE endpoint) where it constantly streams any alerts from 
 * sensors on a minutely basis.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const watchAllAlerts = async (req: Request, res: Response) => {
    // open stream
    res.writeHead(200, {
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream"
    });

    // initial stream so client doesn't have to wait for 60 seconds
    const readings = await readAllSensorAlerts();
    res.write(`data: ${JSON.stringify(readings)}\n\n`)

    // stream data every 60 seconds
    const MS_IN_S: number = 1000;
    const stream: NodeJS.Timeout = setInterval(async () => {
        const readings = await readAllSensorAlerts();
        res.write(`data: ${JSON.stringify(readings)}\n\n`)
    }, 60 * MS_IN_S)

    // close stream when connections ends and stop the interval
    res.on('close', () => {
        clearInterval(stream);
        res.end();
    })
};

/**
 * Implements a server-sent event (SSE endpoint) where it constantly streams alerts from 
 * sensors on a minutely basis for a specific sensor.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const watchSensorAlerts = async (req: Request, res: Response) => {
    // open stream
    res.writeHead(200, {
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream"
    });

    // initial stream so client doesn't have to wait for 60 seconds
    const readings = await readSingleSensorsAlerts(req.params.sensorId);
    res.write(`data: ${JSON.stringify(readings)}\n\n`)

    // stream data every 60 seconds
    const MS_IN_S: number = 1000;
    const stream: NodeJS.Timeout = setInterval(async () => {
        const readings = await readSingleSensorsAlerts(req.params.sensorId);
        res.write(`data: ${JSON.stringify(readings)}\n\n`)
    }, 60 * MS_IN_S)

    // close stream when connections ends and stop the interval
    res.on('close', () => {
        clearInterval(stream);
        res.end();
    })
};

/**
 * Fetches all alert defintions for a sensor for the view to display to the user.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const getSensorAlertConfigurations = async (req: Request, res: Response) => {
    const configurations = readSensorAlertConfigurations(req.params.sensorId);
    res.status(200).json(configurations);
};

/**
 * Adds the definition of an alert to a sensor so that the system can now track and log
 * events that trigger an allert as per this definition.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const addSensorAlertConfiguration = async (req: Request, res: Response) => {
    await addConfiguration(req.params.sensorId, req.body.configuration);
    res.status(200).send();
};

/**
 * Updates the definition of an alert to a sensor. 
 * Refer to docs for addSensorAlertConfiguration(req, res) for more details on alerts.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const changeSensorAlertConfiguration = async (req: Request, res: Response) => {
    await changeConfiguration(req.params.sensorId, req.body.configuration);
    res.status(200).send();
};

/**
 * Deletes the definition of an alert to a sensor. 
 * Refer to docs for addSensorAlertConfiguration(req, res) for more details on alerts.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const deleteSensorAlertConfiguration = async (req: Request, res: Response) => {
    await deleteConfiguration(req.params.sensorId, req.body.configuration);
    res.status(200).send();
};
