import { Schema, model, Document } from 'mongoose';

/**
 * A single record of a message that is generated when an alert condition
 * is violated e.g. when temperature exceeds a limit, an Alert might be sent.
 *
 * The fields within the model are
 *     @time: the time the violation occured
 *     @type: the type of the alert: info, critical etc
 *      @msg: the alert message
 *      @fix: the suggested solution for the alert
 * @sensorId: the id of the sensor the alert is for
 */
export interface IAlert extends Document {
    time: Date;
    type: string;
    sensorId: string;
    msg: string
    fix: string
}

const AlertSchema = new Schema<IAlert>({
    time: Date,
    type: String,
    sensorId: String,
    msg: String,
    fix: String,
})

export const AlertModel = model<IAlert>('Alert', AlertSchema, 'Alerts');