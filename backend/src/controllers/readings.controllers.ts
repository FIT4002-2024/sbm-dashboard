import { Request, Response } from "express";
import {readImmediateReadings, readTimeSeriesReadings} from "../persistence/readings.persistence";

/**
 * Implements a server-sent event (SSE endpoint) where it constantly streams the current minutes 
 * sensor readings from the db and returns them to the client so as long as the client wants to
 * connect and read this.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
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
};

/**
 * Implements a server-sent event where it constantly streams the specified sensors readings
 * for the past x units of time where x is the scope e.g. daily, weekly and returns it to the
 * client as long as the connection remains open
 *
 * Taken from https://stackoverflow.com/a/67184841
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const streamTimeSeries = async (req: Request, res: Response) => {
    const { sensorId, scope } = req.params;

    if (!['hour', 'day', 'week'].includes(scope)) {
        return res.status(400).json({ error: 'Invalid scope: must be one of hour, day, week.' });
    }

    // open stream
    res.writeHead(200, {
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream"
    });

    // initial stream so client doesn't have to wait for 60 seconds
    const readings = await readTimeSeriesReadings(sensorId, scope);
    res.write(`data: ${JSON.stringify(readings)}\n\n`)

    // stream data every 60 seconds
    const MS_IN_S: number = 1000;
    const stream: NodeJS.Timeout = setInterval(async () => {
        const readings = await readTimeSeriesReadings(sensorId, scope);
        res.write(`data: ${JSON.stringify(readings)}\n\n`)
    }, 60 * MS_IN_S)

    // close stream when connections ends and stop the interval
    res.on('close', () => {
        clearInterval(stream);
        res.end();
    })
};
