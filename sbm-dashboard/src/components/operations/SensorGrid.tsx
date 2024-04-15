import React from "react";
import { Flex } from "antd";
import SensorInstance from "./SensorInstance";

interface SensorGridProps {
    onSensorClick: (factoryName: string, sensorType: string) => void;
}

const SensorGrid: React.FC<SensorGridProps> = ({ onSensorClick }) => {
    return (
        <div>
            <Flex wrap="wrap" gap="large" justify="center" style={{ padding: '10px'}}>
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSensorClick("Factory 1", "Temperature Sensor")}
                >
                    <SensorInstance
                        factoryName="Loading Dock"
                        sensorType="Temperature Sensor"
                        currentValue={32}
                        unit="°C"
                        highValue={40}
                        lowValue={22}
                    />
                </div>
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSensorClick("Factory 2", "Pressure Sensor")}
                >
                    <SensorInstance
                        factoryName="Loading Dock"
                        sensorType="Humidity Sensor"
                        currentValue={60}
                        unit="%"
                        highValue={80}
                        lowValue={40}
                    />
                </div>
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSensorClick("Factory 1", "Humidity Sensor")}
                >
                    <SensorInstance
                        factoryName="Warehouse"
                        sensorType="Temperature Sensor"
                        currentValue={24}
                        unit="°C"
                        highValue={38}
                        lowValue={22}
                    />
                </div>
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSensorClick("Factory 2", "Pressure Sensor")}
                >
                    <SensorInstance
                        factoryName="Warehouse"
                        sensorType="Humidity Sensor"
                        currentValue={60}
                        unit="%"
                        highValue={80}
                        lowValue={40}
                    />
                </div>
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSensorClick("Factory 1", "Humidity Sensor")}
                >
                    <SensorInstance
                        factoryName="Freezer Room"
                        sensorType="Temperature Sensor"
                        currentValue={-4}
                        unit="°C"
                        highValue={4}
                        lowValue={-18}
                    />
                </div>
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSensorClick("Factory 1", "Humidity Sensor")}
                >
                    <SensorInstance
                        factoryName="Freezer Room"
                        sensorType="Pressure Sensor"
                        currentValue={23}
                        unit="Psi"
                        highValue={40}
                        lowValue={15}
                    />
                </div>
            </Flex>
        </div>
    );
};

export default SensorGrid;
