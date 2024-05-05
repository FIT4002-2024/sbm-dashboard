import {SensorModel} from "../models/sensor.model";

/**
 * 
 *
 * @return: array of Alert documents
 */
interface IReadAllSensorAlerts {
    (): Promise<any[]>
}

export const readAllSensorAlerts: IReadAllSensorAlerts = async () => {

    return []
}

/**
 * 
 *
 * @param: sensorId: UUID of the sensor in question
 * @return: array of Alert documents
 */
interface IReadSingleSensorAlerts {
    (sensorId: string): Promise<any[]>
}

export const readSingleSensorAlerts: IReadSingleSensorAlerts = async (sensorId: string) => {

    return []
}

/**
 * Associates the definition of an alert & the conditions that trigger it 
 * to a sensor.
 *
 * @param: sensorId: UUID of the sensor in question
 * @return: the created Alert document
 */
interface IAddSensorAlert {
    (sensorId: string): void
}

export const addSensorAlert: IAddSensorAlert = async (sensorId: string) => {


}

/**
 * Updates an alert &/or the conditions that trigger it for a sensor.
 *
 * @param: sensorId: UUID of the sensor in question
 * @return: the created Alert document
 */
interface IChangeSensorAlert {
    (sensorId: string): void
}

export const changeSensorAlert: IChangeSensorAlert = async (sensorId: string) => {


}

