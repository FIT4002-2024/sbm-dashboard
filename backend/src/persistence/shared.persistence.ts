import { Document, FilterQuery, Model, mongo } from "mongoose";
import { READ_FREQUENCY_S } from "../config/server.config";


/**
 * Returns all documents with a time value for the current minute
 * 
 *      @model: a model to be queried
 *  @sensorId?: the sensor to be filtered for
 *     @return: an aray of results for this minute
 */
interface IReadImmediateGeneral {
    <T extends Document>(model:Model<T>, sensorId?: string): Promise<T[]>
}

export const readImmediateGeneral: IReadImmediateGeneral = async <T extends Document>(
    model: Model<T>, sensorId?: string
) => {

    /* calculate the current interval
        for example let's say it's 1h:33m:45s:500ms and READ_FREQ is 10s
        excessTime = 500ms + (45 % 10)s * 1000
                   = 500ms + 5s * 1000
        
        currInterval = 1h:33m:45s:500ms - 0h:0m:5s:500ms
                     = 1h:33m:40s

        this rounds us down to the nearest 10 sec (40s) of the current time
    */
    const now: Date = new Date();
    const MS_PER_S: number = 1000;
    const MS_IN_FREQ: number = MS_PER_S * READ_FREQUENCY_S
    const excessTime: number = now.getMilliseconds() + (now.getSeconds() % READ_FREQUENCY_S) * MS_PER_S;
    const currInterval: number = now.valueOf() - excessTime.valueOf(); //TODO

    // filter out all records not within the current minute
    // if sensorId not provided, get all records
    const filter: FilterQuery<any> = {
        _id: sensorId ? sensorId : { $exists: true },
        time: {
            $gte: new Date(currInterval), $lt: new Date(currInterval + MS_IN_FREQ)
        }
    };

    return await model.find(filter).exec()
}