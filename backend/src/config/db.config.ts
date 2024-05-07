import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const options = {
    maxPoolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin'
};

// Async function to establish a database connection
export const dbConnection = async () => {
    try {
        await mongoose.connect(uri, options);
        console.log("Successfully connected to the database.");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process with a failure code if the connection fails
    }
};