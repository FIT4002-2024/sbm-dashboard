import { SensorReadingModel } from "../models/readings.model";
import {start} from "repl";

/**
 * Connection to database that returns all sensor readings for the current minute
 *
 * @return: array of SensorReading documents
 */
interface IReadImmediateReadings {
    (): Promise<any[]>
}

export const readImmediateReadings: IReadImmediateReadings = async () => {

    // calculate the current minute
    const now: Date = new Date();
    const MS_PER_S: number = 1000;
    const MS_IN_MIN: number = MS_PER_S * 60
    const excessTime: number = now.getMilliseconds() + now.getSeconds() * MS_PER_S;
    const currMinute: number = now.valueOf() - excessTime.valueOf();

    // filter out all records not within the current minute
    const filter: Object = {
        time: {
            $gte: new Date(currMinute), $lt: new Date(currMinute + MS_IN_MIN)
        }
    };

    return await SensorReadingModel.find(filter).exec()
}

/**
 * Connection to database that returns all sensor readings from 'scope' period of time
 * until now
 *
 * @sensorId: the UUID for the sensor whose data is being requested
 * @param: a string indicating the scope either hour, day or week
 *
 * @return: array of SensorReading documents
 */
interface IReadTimeSeriesReadings {
    (sensorId: string, scope: string): Promise<any[]>
}

export const readTimeSeriesReadings: IReadTimeSeriesReadings = async (sensorId: string, scope: string) => {

    // calculate the times for the scope:
    const now: Date = new Date();
    const MS_PER_S: number = 1000;
    const MS_IN_MIN: number = MS_PER_S * 60

    // assume hourly scope unless otherwise specified
    let scopeDurationMS: number = MS_IN_MIN * 60;
    switch (scope) {
        case 'day':
            scopeDurationMS = scopeDurationMS * 24;
            break;
        case 'week':
            scopeDurationMS = scopeDurationMS * 7;
            break;
    }

    // find start and end times for time series
    const excessTimeFromCurrMinute: number = now.getMilliseconds() + now.getSeconds() * MS_PER_S;
    const currMinute: number = now.valueOf() - excessTimeFromCurrMinute.valueOf();
    const startTime: number = now.valueOf() - scopeDurationMS;

    // filter out all records not within the specified scope
    const filter: Object = {
        sensorId: sensorId,
        time: {
            $gte: new Date(startTime), $lt: new Date(currMinute + MS_IN_MIN)
        }
    };

    return await SensorReadingModel.find(filter).exec()
}
