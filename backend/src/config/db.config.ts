import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Constructing the connection string using environment variables
console.log(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

const uri: string = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Connection options
const options: mongoose.ConnectOptions = {
    maxPoolSize: 10, // Limits the number of connections in the MongoDB connection pool
    authSource: 'admin' // Specifies the database that should be used to authenticate (if required)
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


