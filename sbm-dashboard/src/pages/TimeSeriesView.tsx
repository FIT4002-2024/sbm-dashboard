import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';



const TimeSeriesView: React.FC = () => {
    const { sensorId } = useParams<{ sensorId: string }>();
    const sensorProps = useSelector((state: RootState) => state.sensors.sensorProps);
    const [sensorName, setSensorName] = useState<string>('');
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    useEffect(() => {
        console.log('sensorId:', sensorId);
        console.log('factoryName:', sensorProps.factoryName);
        setSensorName(`Sensor: ${sensorId}`);
    }, [sensorId]);

    if (!sensorProps) {
        return <div>Loading...</div>;
    }

    const { factoryName, sensorType, currentValue, unit, highValue, lowValue } = sensorProps;

    // Fetch the sensor data based on sensorId and display it in a time series view
    // This is just a placeholder and needs to be replaced with actual implementation
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <h1>Operations</h1>
                <div style={{ marginTop: '100px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    <Tooltip title="More Info" onClick={() => setModalIsOpen(true)}>
                        <InfoCircleOutlined />
                    </Tooltip>
                    <Dialog open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
                        <DialogTitle>Sensor Details</DialogTitle>
                        <DialogContent>
                            <h2>{factoryName}</h2>
                            <p>Sensor ID: {sensorId}</p>
                            <p>Sensor Type: {sensorType}</p>
                            <p>Current Value: {currentValue}</p>
                            <p>Unit: {unit}</p>
                            <p>High Value: {highValue}</p>
                            <p>Low Value: {lowValue}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setModalIsOpen(false)}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div style={{ position: 'absolute', left: '0' }}>
                    <Link to="/">
                        <button style={{ fontSize: '2em' }}>&#8592;</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TimeSeriesView;