import { Schema, model } from 'mongoose';

/**
 * SensorReading represents a single record of a sensors reading for a given minute
 * within a day.
 *
 * The fields within the model are
 *  @timestamp: the minute the reading was made
 *       @type: the type of the reading e.g. temperature, humidity
 *   @sensorId: the sensor models _id field
 *      @units: the unit of measurement for this reading e.g. deg, ppm
 *       @data: the raw measurement for this reading
 */
interface ISensorReading {
    timestamp: Date;
    type: string;
    sensorId: string;
    units: string;
    data: number;
}

const SensorReadingSchema = new Schema<ISensorReading>({
    timestamp: Date,
    type: String,
    sensorId: String,
    units: String,
    data: Number
})

const SensorReadingModel = model<ISensorReading>('TimeSeries', SensorReadingSchema);

/**
 * SensorAggregatedReading is an aggregation of sensor reading data over a given period to improve
 * read efficiency, preventing the need for aggregation on each read.
 */
interface ISensorAggregatedReading {

}


export default SensorReadingModel;

