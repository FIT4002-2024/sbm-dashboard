import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Constructing the connection string using environment variables
console.log(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

// const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const uri = "mongodb://initial_primary:27017,replica_1:27018,replica_2:27019/sbm_dashboard?replicaSet=sbm";

// Connection options with new parser and unified topology
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


