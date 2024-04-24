import { SensorReadingModel } from "../models/readings.model";

/**
 * Interface for the function to fetch immediate sensor readings
 * 
 * @param startTime - The start time from which to fetch sensor readings.
 * @returns An array of SensorReading documents.
 */
interface IReadImmediateReadings {
    (startTime: Date): Promise<any[]>;
}

/**
 * Fetches immediate sensor readings from the database starting from the specified time.
 * 
 * @param startTime - The start time from which to fetch sensor readings.
 * @returns An array of SensorReading documents.
 */
export const readImmediateReadings: IReadImmediateReadings = async (startTime) => {
    // Filter to fetch sensor readings starting from the specified startTime
    const filter = {
        time: { $gte: startTime }
    };

    return await SensorReadingModel.find(filter).exec();
};
