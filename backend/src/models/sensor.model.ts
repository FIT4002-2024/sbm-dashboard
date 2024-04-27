import { Schema, model } from 'mongoose';

/**
 * Sensor represents a unique sensor within the business
 *
 * The fields within the model are
 *      @name: the name of the sensor
 *      @type: the type fo data the sensor outputs
 *  @location: the location the sensor is located in
 */
interface ISensor {
    name: string;
    type: string;
    location: string;
}

const SensorSchema = new Schema<ISensor>({
    name: String,
    type: String,
    location: String
})

SensorSchema.index({ name: 1, location: 1 }, { unique: true })

const SensorModel = model<ISensor>('TimeSeries', SensorSchema);

export default SensorModel;

