/*
https://www.mongodb.com/blog/post/schema-design-for-time-series-data-in-mongodb

Have a reading per day
The values column has 1 entry per hour
Each hour has 1 entry per minute

This prevents needing to loop through every minute

use server-sent-events https://stackoverflow.com/questions/34657222/how-to-use-server-sent-events-in-express-js
https://medium.com/@jsameer/real-time-askbot-with-react-express-chatgpt-8bb465352a77

{
    timestamp_day: "ISODate()",
    type: "temperature",
    sensorID: "<UUID>"
    values: {
        0: {
            0: "",
            ...,
            59: ""
        },
        ...,
        23: {...}
    }
}
*/

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 80;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
    return res.json({ data: "success" });
});


app.listen(port, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});