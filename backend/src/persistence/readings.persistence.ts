import { SensorReadingModel } from "../models/readings.model";

/**
 * Interface for the function to fetch immediate sensor readings
 * 
 * @param startTime - The start time from which to fetch sensor readings.
 * @param endTime - The end time until which to fetch sensor readings.
 * @returns An array of SensorReading documents.
 */
interface IReadImmediateReadings {
    (startTime: Date, endTime: Date): Promise<any[]>;
}

/**
 * Fetches immediate sensor readings from the database within the specified time range.
 * 
 * @param startTime - The start time from which to fetch sensor readings.
 * @param endTime - The end time until which to fetch sensor readings.
 * @returns An array of SensorReading documents.
 */
export const readImmediateReadings: IReadImmediateReadings = async (startTime, endTime) => {
    // Filter to fetch sensor readings within the specified time range
    const filter = {
        time: { $gte: startTime, $lt: endTime }
    };

    return await SensorReadingModel.find(filter).exec();
};

