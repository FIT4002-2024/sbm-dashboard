import { SensorModel } from '../models/sensor.model';

/**
 * Connection to database that returns all sensor IDs
 *
 * @return: array of sensor IDs
 */
interface IGetAllSensorIds {
    (): Promise<string[]>
}

export const getAllSensorIds: IGetAllSensorIds = async () => {
    try {
        const sensors = await SensorModel.find({}, '_id');
        const sensorIds = sensors.map(sensor => sensor._id.toString());
        return sensorIds;
    } catch (err) {
        throw err;
    }
};