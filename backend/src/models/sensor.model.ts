import { Schema, model, Document } from 'mongoose';

/**
 * A condition that triggers an alert and associated metadata and info
 *
 *  @loLimit: the lower bound of the range that will send an alert
 *  @hiLimit: the upper bound of the range that will send an alert
 *     @type: the type of alert e.g. info, warning, critical
 *      @msg: the message to be displayed when the constraint is broken
 *      @fix: a suggested action to address the alert e.g. turn on the AC
 */
export interface IAlertDefinition extends Document {
    loLimit: number;
    hiLimit: number;
    type: string;
    msg: string;
    fix: string;
}

const AlertDefinitionSchema = new Schema<IAlertDefinition>({
    loLimit: Number,
    hiLimit: Number,
    type: String,
    msg: String,
    fix: String
}, {_id: false});

/**
 * Sensor represents a unique sensor within the business
 *
 * The fields within the model are
 *      @name: the name of the sensor
 *      @type: the type fo data the sensor outputs
 *  @location: the location the sensor is located in
 */
interface ISensor extends Document {
    name: string;
    type: string;
    location: string;
    alertDefinitions: IAlertDefinition[]
}

const SensorSchema = new Schema<ISensor>({
    name: String,
    type: String,
    location: String,
    alertDefinitions: [AlertDefinitionSchema]
})

SensorSchema.index({ name: 1, location: 1 }, { unique: true })

export const SensorModel = model<ISensor>('Sensor', SensorSchema, 'Sensors');
