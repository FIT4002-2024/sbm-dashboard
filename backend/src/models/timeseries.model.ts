import { Schema, model } from 'mongoose';

interface ITimeSeries {
    timestamp: Date;
    type: string;
    sensorId: string;
    unit: string;
    data: number;
}

const TimeSeriesSchema = new Schema<ITimeSeries>({
    timestamp: Date,
    type: String,
    sensorId: String,
    unit: String,
    data: Number
})

const TimeSeries = model<ITimeSeries>('TimeSeries', TimeSeriesSchema);

export default TimeSeries;

