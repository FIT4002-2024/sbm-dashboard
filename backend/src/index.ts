import express from 'express';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from "cors";
import {dbConnection} from "./config/db.config";
import sensorReadingsRouter from "./routes/readings.routes";
import alertsRouter from "./routes/alerts.routes";

dotenv.config();
const app = express();
const port = process.env.API_PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Server-side CORS setup for SSE
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET"],
    credentials: true
}));

// app.use((req, res, next) => {
//     if(req.method = 'GET') {
//         app.locals.grain=60000
//     }
//     next()
// })

app.use('/api/sensors/', sensorReadingsRouter);
app.use('/api/alerts/', alertsRouter);


dbConnection()
    .then((conn) => {
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        })
    })
    .catch((err) => {
        console.log(err)
    });


