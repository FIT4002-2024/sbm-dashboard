import {SensorReadingModel} from "../models/readings.model";

/**
 * Connection to database that returns all sensor readings for the current minute since epoch time
 *
 * @return: array of SensorReading documents
 */
interface IReadImmediateReadings {
    (): Promise<any[]>
}

/**
 * Connection to database that returns all sensor readings for the current minute since epoch time
 *
 * @return: array of SensorReading documents
 */
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

/**
 * Connection to database that returns all sensor readings from 'scope' period of time
 * until now
 *
 * @sensorId: the UUID for the sensor whose data is being requested
 * @param: a string indicating the scope either hour, day or week
 *
 * @return: array of SensorReading documents
 */
export const readTimeSeriesReadings: IReadTimeSeriesReadings = async (sensorId: string, scope: string) => {

    // calculate the times for the scope:
    const now: Date = new Date();
    const MS_PER_S: number = 1000;
    const MS_IN_MIN: number = MS_PER_S * 60

    const excessTime: number = now.getMilliseconds() + now.getSeconds() * MS_PER_S;
    const currMinute: number = now.valueOf() - excessTime.valueOf();

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

    const scopeDurationMS: number = 0; // now - scope

    // filter out all records not within the specified scope
    const filter: Object = {

    };

    // const readings = await SensorReadingModel.find({
    //     sensorId,
    //     time: { $gte: startTime }
    // }).exec();

    return await SensorReadingModel.find(filter).exec()
}
