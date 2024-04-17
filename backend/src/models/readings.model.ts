import { Schema, model, Document } from 'mongoose';
import * as mongoose from "mongoose";

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
export interface ISensorReading extends Document {
    time: Date;
    type: string;
    sensorId: string;
    units: string;
    data: number;
}

const SensorReadingSchema = new Schema<ISensorReading>({
    time: Date,
    type: String,
    sensorId: String,
    units: String,
    data: Number
})

export const SensorReadingModel = model<ISensorReading>('SensorReading', SensorReadingSchema, "SensorReadings");
