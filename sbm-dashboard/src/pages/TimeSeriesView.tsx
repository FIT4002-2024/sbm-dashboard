import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const TimeSeriesView = (): JSX.Element => {
    const { sensorId } = useParams<{ sensorId: string }>();

    // Log the sensorId to the console
    useEffect(() => {
        console.log('sensorId:', sensorId);
    }, [sensorId]);

    // Fetch the sensor data based on sensorId and display it in a time series view
    // This is just a placeholder and needs to be replaced with actual implementation
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/">
                    <button style={{ fontSize: '2em' }}>&#8592;</button>
                </Link>
                <h1>Operations</h1>
                <div></div> {/* This empty div is used to keep the space between the button and the title */}
            </div>
            <h2>Time Series View for Sensor {sensorId}</h2>
        </div>
    );
}

export default TimeSeriesView;