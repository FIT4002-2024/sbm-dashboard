import { Document, FilterQuery, Model, mongo } from "mongoose";


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

    // calculate the current minute
    const now: Date = new Date();
    const MS_PER_S: number = 1000;
    const MS_IN_MIN: number = MS_PER_S * 60
    const excessTime: number = now.getMilliseconds() + now.getSeconds() * MS_PER_S;
    const currMinute: number = now.valueOf() - excessTime.valueOf();

    // filter out all records not within the current minute
    // if sensorId not provided, get all records
    const filter: FilterQuery<any> = {
        _id: sensorId ? sensorId : { $exists: true },
        time: {
            $gte: new Date(currMinute), $lt: new Date(currMinute + MS_IN_MIN)
        }
    };

    return await model.find(filter).exec()
}