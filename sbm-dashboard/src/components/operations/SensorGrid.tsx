import React from "react";
import { Flex } from "antd";
import SensorInstance from "./SensorInstance";

interface SensorData {
    factoryName: string;
    sensorId: string;
    sensorType: string;
    currentValue: number;
    unit: string;
    highValue: number;
    lowValue: number;
}

interface SensorGridProps {
    sensorData: SensorData[];
    onSensorClick: (factoryName: string, sensorId: string) => void;
}

const SensorGrid: React.FC<SensorGridProps> = ({ sensorData, onSensorClick }) => {
    return (
        <Flex wrap="wrap" gap="large" justify="center" style={{ padding: '10px'}}>
            {sensorData.map(sensor => (
                <div
                    key={`${sensor.factoryName}-${sensor.sensorId}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSensorClick(sensor.factoryName, sensor.sensorId)}
                >
                    <SensorInstance {...sensor} />
                </div>
            ))}
        </Flex>
    );
};

export default SensorGrid;
