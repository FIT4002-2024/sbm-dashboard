import { Request, Response } from "express";
import {readImmediateReadings} from "../persistence/readings.persistence";
import {SensorReadingModel} from "../models/readings.model";

/**
 * Implements a server-sent event where it constantly streams the current minutes sensor readings
 * from the db and returns them to the client so as long as the client wants to
 * connect and read this.
 *
 * Taken from https://stackoverflow.com/a/67184841
 *
 * @param req
 * @param res
 */
export const streamImmediate = async (req: Request, res: Response) => {

    // open stream
    res.writeHead(200, {
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream"
    });

    // initial stream so client doesn't have to wait for 60 seconds
    const readings = await readImmediateReadings();
    res.write(`data: ${JSON.stringify(readings)}\n\n`)

    // stream data every 60 seconds
    const MS_IN_S: number = 1000;
    const stream: NodeJS.Timeout = setInterval(async () => {
        const readings = await readImmediateReadings();
        res.write(`data: ${JSON.stringify(readings)}\n\n`)
    }, 60 * MS_IN_S)

    // close stream when connections ends and stop the interval
    res.on('close', () => {
        clearInterval(stream);
        res.end();
    })
}


export const getTimeseries = async (req: Request, res: Response) => {
    const { sensorId, scope } = req.params;

    // Validate scope
    const validScopes = ['hour', 'day', 'week'];
    if (!validScopes.includes(scope)) {
        return res.status(400).json({ error: 'Invalid scope. Must be one of: hour, day, week.' });
    }

    // Calculate start time based on scope
    const now = new Date();
    let startTime;
    switch (scope) {
        case 'hour':
            startTime = new Date(now.getTime() - 60 * 60 * 1000);
            break;
        case 'day':
            startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
        case 'week':
            startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
    }

    // Query SensorReadingModel
    try {
        const readings = await SensorReadingModel.find({
            sensorId,
            time: { $gte: startTime }
        }).exec();

        // Return readings
        res.json(readings);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving sensor readings.' });
    }
};