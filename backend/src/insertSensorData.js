import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { SensorReadingModel } from './models/readings.model.ts';

dotenv.config();

const mongoURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose
	.connect(mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error('MongoDB connection error:', err));

// Sample data array mimicking the data structure you provided
const sensorDataArray = [
	{ time: new Date('2024-04-16T16:23:10.000Z'), type: 'humidity', sensorId: 'HALFKJN', units: 'gpk', data: 56 },
	{ time: new Date('2024-04-16T16:24:10.000Z'), type: 'humidity', sensorId: 'HALFKJN', units: 'gpk', data: 56 }
	// Add more entries as necessary
];

// Insert data into MongoDB using the SensorReadingModel
SensorReadingModel.insertMany(sensorDataArray)
	.then(() => {
		console.log('Data inserted successfully');
		mongoose.disconnect(); // Close the connection after successful insertion
	})
	.catch((err) => {
		console.error('Error inserting data:', err);
		mongoose.disconnect(); // Close the connection if there is an error
	});
