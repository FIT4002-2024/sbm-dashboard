import {SensorModel, IAlertDefinition} from "../models/sensor.model";
import { IAlert, AlertModel } from "../models/alert.model";
import { readImmediateGeneral } from "./shared.persistence";
import { FilterQuery, UpdateQuery, mongo } from "mongoose";
import { config } from "dotenv";
const ObjectId = require('mongoose').Types.ObjectId

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

    const [sensor] = await SensorModel.find(filter).exec()
    return sensor.alertDefinitions
}

/**
 * Used for read, update or delete of a definition/configuration of an alert & the conditions that trigger 
 * it for a sensor. 
 *
 * @param: sensorId: UUID of the sensor in question
 * @param: config: the alert configuration being added
 * @return: the created Alert document
 */
interface IRUDSensorAlertConfiguration {
    (sensorId: string, alertConfiguration: IAlertDefinition): void
}

export const addSensorAlertConfiguration: IRUDSensorAlertConfiguration = async (sensorId: string, alertConfiguration: any) => {
    const filter: FilterQuery<any> = {
        _id: sensorId
    };

    // addToSet ensures no duplicates of config exist
    const updateQuery: UpdateQuery<any> = {
        $addToSet: {alertDefinitions: alertConfiguration}
    }
    
    SensorModel.updateOne(
        filter,
        updateQuery
    ).exec()

    // query document then save???
}

export const changeSensorAlertConfiguration: IRUDSensorAlertConfiguration = async (sensorId: string, alertConfiguration: any) => {
    // find the sensor
    // update it by finding the old versiom
    // ensure no duplicates
}

export const deleteSensorAlertConfiguration: IRUDSensorAlertConfiguration = async (sensorId: string, alertConfiguration: any) => {
    const filter: FilterQuery<any> = {
        _id: sensorId
    };

    // addToSet ensures no duplicates of config exist
    const updateQuery: UpdateQuery<any> = {
        $pull: {alertDefinitions: alertConfiguration}
    }
    
    SensorModel.updateOne(
        filter,
        updateQuery
    )
}
