import {SensorModel, IAlertDefinition} from "../models/sensor.model";
import { IAlert, AlertModel } from "../models/alert.model";
import { readImmediateGeneral } from "./shared.persistence";
import { FilterQuery } from "mongoose";

/**
 * Retrieve all current alerts for this minute.
 *
 * @return: array of Alert documents
 */
interface IReadAllSensorAlerts {
    (): Promise<IAlert[]>
}

export const readAllSensorAlerts: IReadAllSensorAlerts = async () => {
    return await readImmediateGeneral(AlertModel)
}

/**
 * Retrieve all current alerts for this minute for a sensor 
 *
 * @param: sensorId: UUID of the sensor in question
 * @return: array of Alert documents
 */
interface IReadSingleSensorsAlerts {
    (sensorId: string): Promise<IAlert[]>
}

export const readSingleSensorsAlerts: IReadSingleSensorsAlerts = async (sensorId: string) => {
    return await readImmediateGeneral(AlertModel, sensorId)
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
    const filter: FilterQuery<any> = {
        _id: sensorId
    };

    const [alertDefinitions] = await SensorModel.find(filter).exec()
    return alertDefinitions
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
    (sensorId: string, alertConfiguration: IAlertDefinition): void
}

export const addSensorAlertConfiguration: IAddSensorAlertConfiguration = async (sensorId: string, alertConfiguration: any) => {
    // find the sensor
    // update it by inserting the new config into its alertDefinition key
    // ensure no duplicates

}

/**
 * Updates an alert definition i.e. the conditions that trigger it for a sensor.
 *
 * @param: sensorId: UUID of the sensor in question
 * @return: the created Alert document
 */
interface IChangeSensorAlertConfiguration {
    (sensorId: string, updatedConfiguration: IAlertDefinition): void
}

export const changeSensorAlertConfiguration: IChangeSensorAlertConfiguration = async (sensorId: string, alertConfiguration: any) => {
    // find the sensor
    // update it by finding the old versiom
    // ensure no duplicates
}

/**
 * Deletes an alert definition i.e. the conditions that trigger it for a sensor.
 *
 * @param: sensorId: UUID of the sensor in question
 * @return: the created Alert document
 */
interface IDeleteSensorAlertConfiguration {
    (sensorId: string, alertConfiguration: any): void
}

export const deleteSensorAlertConfiguration: IDeleteSensorAlertConfiguration = async (sensorId: string, alertConfiguration: any) => {

    // find the configuration
    // remove it from the array
}
