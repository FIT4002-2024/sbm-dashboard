import { getAllSensorIds } from '../persistence/sensors.persistence';

import { Request, Response } from 'express';

export const getSensorIds = async (req: Request, res: Response) => {
    try {
        const sensorIds = await getAllSensorIds();
        res.json(sensorIds);
    } catch (err) {
        res.status(500).send(err);
    }
};