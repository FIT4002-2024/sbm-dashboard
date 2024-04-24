import { Request, Response } from "express";
import { readImmediateReadings } from "../persistence/readings.persistence";

/**
 * Implements a server-sent event (SSE) endpoint to simulate the streaming of sensor readings stored in the database.
 * This approach simulates real-time updates by cyclically sending existing database entries as if they are arriving live.
 * Additionally, sends the first reading immediately upon connection.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const streamImmediate = async (req: Request, res: Response) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });

    let index = 0; // Index to keep track of the current reading being sent

    // Function to fetch all current sensor readings from the database
    const fetchAllSensorReadings = async () => {
        try {
            return await readImmediateReadings();
        } catch (error) {
            console.error('Error fetching sensor readings:', error);
            return []; // Return an empty array in case of error
        }
    };

    
    // Fetch all readings once and cycle through them
    const allReadings = await fetchAllSensorReadings();

    if (allReadings.length > 0) {
        // Send the first reading immediately
        const initialReading = allReadings[0];
        res.write(`data: ${JSON.stringify([initialReading])}\n\n`);
        index = 1; // Start from the next reading for periodic updates
    }
    

    // Function to periodically send data
    const intervalId = setInterval(() => {
        if (allReadings.length > 0) {
            const reading = allReadings[index % allReadings.length]; // Cycle through readings
            res.write(`data: ${JSON.stringify([reading])}\n\n`); // Send current reading
            index++; // Move to the next reading
        } else {
            res.write(': No data available\n\n');
        }
    }, 1000); // Send data every 60 seconds

    // Clean up when client closes connection
    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
        console.log('Stopped sending events as client closed the connection');
    });
};

