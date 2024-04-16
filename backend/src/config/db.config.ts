import * as mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri: string = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const options: object = {maxPoolSize: 10}

export const dbConnection = async () => {return mongoose.connect(uri, options)}

