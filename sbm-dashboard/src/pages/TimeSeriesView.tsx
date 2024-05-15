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
import { Line } from 'react-chartjs-2';
import { 
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    ToolTip,
    Legend
} from 'chart.js'



const TimeSeriesView: React.FC = () => {
    const { sensorId } = useParams<{ sensorId: string }>();
    const sensorProps = useSelector((state: RootState) => state.sensors.sensorProps);
    const [sensorName, setSensorName] = useState<string>('');
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [data, setData] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const chartWidth = window.innerWidth * 0.8; // 80% of window width
    const chartHeight = window.innerHeight * 0.6;

    useEffect(() => {
        // ...
    
        const ctx = document.getElementById('myChart').getContext('2d');
        new ChartJS(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sensor Readings',
                    data: data,
                    fill: false,
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                }],
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'second'
                        }
                    },
                    y: {
                        type: 'linear'
                    }
                }
            }
        });
    
        // ...
    }, [sensorId]);

    if (!sensorProps) {
        return <div>Loading...</div>;
    }

    const { factoryName, sensorType, currentValue, unit, highValue, lowValue } = sensorProps;

    // Fetch the sensor data based on sensorId and display it in a time series view
    // This is just a placeholder and needs to be replaced with actual implementation
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                <h1>Operations</h1>
                <div style={{ position: 'absolute',  top: '50px', left: '10px'}}>
                    <Link to="/">
                        <button style={{ fontSize: '2em' }}>&#8592;</button>
                    </Link>
                </div>
                <div style={{position: 'absolute', top: '100px', left: '10px'}}>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px'}}>
                        <h3 style={{ marginRight: '10px' }}>Sensor: {sensorId}</h3>
                        <Tooltip title="More Info" onClick={() => setModalIsOpen(true)}>
                            <InfoCircleOutlined />
                        </Tooltip>
                    </div>
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
                <div style={{ marginTop: '100px' }}>
                <canvas id="myChart" width={chartWidth} height={chartHeight}></canvas>
            </div>
            </div>
        </div>
    );
};

export default TimeSeriesView;