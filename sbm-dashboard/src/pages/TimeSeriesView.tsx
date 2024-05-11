import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface TimeSeriesProps {
    sensorId: string;
}

const TimeSeriesView = ({ sensorId }: TimeSeriesProps): JSX.Element => {
    // Log the sensorId to the console
    useEffect(() => {
        console.log('sensorId:', sensorId);
    }, [sensorId]);

    // Fetch the sensor data based on sensorId and display it in a time series view
    // This is just a placeholder and needs to be replaced with actual implementation
    return (
        <div>
            <Link to="/">
                <button>
                    &#8592; Back to Operations
                </button>
            </Link>
            <h1>Time Series View for Sensor {sensorId}</h1>
        </div>
    );
}

export default TimeSeriesView;