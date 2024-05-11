import React from "react";
import { Card, Row, Col } from "antd";
import { ExclamationCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface SensorProps {
    factoryName: string;
    sensorId: string;
    sensorType: string;
    currentValue: number;
    unit: string;
    highValue: number;
    lowValue: number;
}

const SensorInstance: React.FC<SensorProps> = ({
    factoryName,
    sensorId,
    sensorType,
    currentValue,
    unit,
    highValue,
    lowValue
}: SensorProps): JSX.Element => {
    return (
        <div>
            <Link to={`/time-series/${sensorId}`}>
                <Card style={{ width: '300px', height: '250px', boxShadow: '1px 1px 5px 1px #000000' }}>
                    {/* First Row */}
                    <Row style={{ height: '50px' }}>
                        <Col flex={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                            <TrophyOutlined style={{ fontSize: '24px' }} />
                        </Col>
                        <Col flex={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', backgroundColor: 'white' }}>
                            <div>
                                <h2 style={{ padding: 0, margin: 0 }}>{factoryName}</h2>
                                <p style={{ padding: 0, margin: 0 }}>{sensorId + "-" + sensorType}</p>
                            </div>
                        </Col>
                        <Col flex={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                            <ExclamationCircleOutlined style={{ fontSize: '16px', color: 'red' }} />
                        </Col>
                    </Row>
                    {/* Second Row */}
                    <Row style={{ height: '100px' }}>
                        <Col flex={10} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                            <h1 style={{ fontSize: '64px' }}>{currentValue}</h1>
                        </Col>
                        <Col flex={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', backgroundColor: 'white' }}>
                            <p>{unit}</p>
                        </Col>
                        <Col flex={1}>
                            {/* Nested Rows */}
                            <Row style={{ height: '25px', marginBottom: '-10px', display: 'flex', alignItems: 'center', justifyContent: 'left', backgroundColor: 'white' }}>
                                <p>High: {highValue}</p>
                            </Row>
                            <Row style={{ height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'left', backgroundColor: 'white' }}>
                                <p>Low: {lowValue}</p>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </Link>
        </div>
    );
}

export default SensorInstance;
