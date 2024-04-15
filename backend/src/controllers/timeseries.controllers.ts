import { Request, Response } from "express";
import TimeSeries from '../models/timeseries.model';

export const streamTimeseries = async (
    req: Request, res: Response
) => {
    // use server-sent-events https://stackoverflow.com/questions/34657222/how-to-use-server-sent-events-in-express-js
    // https://medium.com/@jsameer/real-time-askbot-with-react-express-chatgpt-8bb465352a77

}