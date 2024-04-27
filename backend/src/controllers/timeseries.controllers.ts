import { Request, Response } from 'express';
import { SensorReadingModel } from '../models/readings.model';

export const getTimeseries = async (req: Request, res: Response) => {
    const { sensorId, scope } = req.params;

    // Validate scope
    const validScopes = ['hour', 'day', 'week'];
    if (!validScopes.includes(scope)) {
        return res.status(400).json({ error: 'Invalid scope. Must be one of: hour, day, week.' });
    }

    // Calculate start time based on scope
    const now = new Date();
    let startTime;
    switch (scope) {
        case 'hour':
            startTime = new Date(now.getTime() - 60 * 60 * 1000);
            break;
        case 'day':
            startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
        case 'week':
            startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
    }

    // Query SensorReadingModel
    try {
        const readings = await SensorReadingModel.find({
            sensorId,
            time: { $gte: startTime }
        }).exec();

        // Return readings
        res.json(readings);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving sensor readings.' });
    }
};