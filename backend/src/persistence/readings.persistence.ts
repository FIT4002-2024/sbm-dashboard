import {IReadImmediateReadings} from "./interfaces/readings.persistence";

/**
 * Connection to database that returns all sensor readings for the current minute
 */
export const readImmediateReadings: IReadImmediateReadings = () => {
    // connect to database here and return all the values for all sensors within the current minute

    return []
}