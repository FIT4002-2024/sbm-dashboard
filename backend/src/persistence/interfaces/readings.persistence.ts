/**
 * Connection to database that returns all sensor readings for the current minute
 */
export interface IReadImmediateReadings {
    (): any[]
}