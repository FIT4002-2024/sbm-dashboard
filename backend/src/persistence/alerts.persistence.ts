import {SensorModel} from "../models/sensor.model";
import { IAlert, IAlertDefinition, AlertModel } from "../models/alert.model";

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
interface IReadSingleSensorsAlerts {
    (sensorId: string): Promise<any[]>
}

export const readSingleSensorsAlerts: IReadSingleSensorsAlerts = async (sensorId: string) => {

    return []
}

/**
 * Gets all configurations made for a sensor that would cause an alert to be created
 *
 * @param: sensorId: UUID of the sensor in question
 * @return: the created Alert document
 */
interface IReadSensorAlertConfigurations {
    (sensorId: string): void
}

export const readSensorAlertConfigurations: IReadSensorAlertConfigurations = async (sensorId: string) => {


}

/**
 * Associates the definition/configuration of an alert & the conditions that trigger it 
 * to a sensor. 
 *
 * TODO add config to params
 * @param: sensorId: UUID of the sensor in question
 * @return: the created Alert document
 */
interface IAddSensorAlertConfiguration {
    (sensorId: string, alertConfiguration: any): void
}

export const addSensorAlertConfiguration: IAddSensorAlertConfiguration = async (sensorId: string, alertConfiguration: any) => {


}

/**
 * Updates an alert definition i.e. the conditions that trigger it for a sensor.
 *
 * @param: sensorId: UUID of the sensor in question
 * @return: the created Alert document
 */
interface IChangeSensorAlertConfiguration {
    (sensorId: string, updatedConfiguration: any): void
}

export const changeSensorAlertConfiguration: IChangeSensorAlertConfiguration = async (sensorId: string, alertConfiguration: any) => {


}

/**
 * Deletes an alert definition i.e. the conditions that trigger it for a sensor.
 *
 * @param: sensorId: UUID of the sensor in question
 * @return: the created Alert document
 */
interface IDeleteSensorAlertConfiguration {
    (sensorId: string): void
}

export const deleteSensorAlertConfiguration: IDeleteSensorAlertConfiguration = async (sensorId: string) => {


}
