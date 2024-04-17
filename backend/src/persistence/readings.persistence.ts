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
