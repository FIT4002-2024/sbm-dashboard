import { Schema, model } from 'mongoose';

enum ConditionTypes {
    gt = '>',
    lt = '<',
    gte = '>=',
    lte = '<=',
    eq = '==',
    neq = '!=',
}

/**
 * A condition that triggers an alert and associated metadata and info
 *
 *       @limit: the value that the alert is based on
 *  @condition: the condition against Alert.limit which if broken, causes an alert e.g. '>='
 *        @type: the type of alert e.g. info, warning, critical
 *         @msg: the message to be displayed when the constraint is broken
 *         @fix: a suggested action to address the alert e.g. turn on the AC
 */
export interface IAlertDefinition {
    limit: number;
    condition: ConditionTypes;
    type: string;
    msg: string;
    fix: string;
}

/**
 * A single record of a message that is generated when an alert condition
 * is violated e.g. when temperature exceeds a limit, an Alert might be sent.
 *
 * The fields within the model are
 *      @name: the name of the sensor
 *      @type: the type fo data the sensor outputs
 *  @location: the location the sensor is located in
 */
export interface IAlert {
    time: Date,
    msg: string
}

const AlertSchema = new Schema<IAlert>({
    time: Date,
    msg: String
})

export const AlertModel = model<IAlert>('Alert', AlertSchema, 'Alerts');