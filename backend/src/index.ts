import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import {dbConnection} from "./config/db.config";
import sensorReadingsRouter from "./routes/readings.routes";
import alertsRouter from "./routes/alerts.routes";
import { SERVER_PORT } from './config/server.config';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Server-side CORS setup for SSE
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}));

app.use((req, res, next) => {
    // console.log(req.body)
    next()
})

app.use('/api/sensors/', sensorReadingsRouter);
app.use('/api/alerts/', alertsRouter);


dbConnection()
    .then((conn) => {
        app.listen(SERVER_PORT, () => {
            console.log(`listening on port ${SERVER_PORT}`);
        })
    })
    .catch((err) => {
        console.log(err)
    });


