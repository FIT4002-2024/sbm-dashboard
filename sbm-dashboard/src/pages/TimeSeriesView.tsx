import React from 'react';

interface TimeSeriesProps {
    sensorId: string;
}

const TimeSeriesView = ({ sensorId }: TimeSeriesProps): JSX.Element => {
    // Fetch the sensor data based on sensorId and display it in a time series view
    // This is just a placeholder and needs to be replaced with actual implementation
    return (
        <div>
            <h1>Time Series View for Sensor {sensorId}</h1>
        </div>
    );
}

export default TimeSeriesView;