import express from 'express';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from "cors";
import sensorsRouter from "./routes/sensor.routes";

dotenv.config();
const app = express();
const port = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/sensors/', sensorsRouter);

app.listen(port, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});