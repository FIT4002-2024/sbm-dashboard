import express from 'express';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from "cors";
import {dbConnection} from "./config/db.config";
import sensorsRouter from "./routes/readings.routes";

dotenv.config();
const app = express();
const port = process.env.API_PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/sensors/', sensorsRouter);

dbConnection()
    .then((conn) => {
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        })
    })
    .catch((err) => {
        console.log(err)
    });


