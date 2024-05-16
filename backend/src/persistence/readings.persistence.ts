import { ISensorReading, SensorReadingModel } from "../models/readings.model";
import { readImmediateGeneral } from "./shared.persistence";
import {newDateInLocale} from "../util/date.util"

/**
 * Connection to database that returns all sensor readings for the current minute
 *
 * @return: array of SensorReading documents
 */
interface IReadImmediateReadings {
    (): Promise<ISensorReading[]>
}

export const readImmediateReadings: IReadImmediateReadings = async () => {
    return await readImmediateGeneral(SensorReadingModel);
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
    (sensorId: string, scope: string): Promise<ISensorReading[]>
}

export const readTimeSeriesReadings: IReadTimeSeriesReadings = async (sensorId: string, scope: string) => {

    // calculate the times for the scope:
    const now: Date = newDateInLocale();
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
    const currMinute: Date = newDateInLocale(now.valueOf() - excessTimeFromCurrMinute.valueOf() + MS_IN_MIN);
    const startTime: Date = newDateInLocale(now.valueOf() - scopeDurationMS);

    // filter out all records not within the specified scope
    const filter: Object = {
        sensorId: sensorId,
        time: {
            $gte: startTime,
            $lt: currMinute
        }
    };

    return await SensorReadingModel.find(filter).exec()
}
