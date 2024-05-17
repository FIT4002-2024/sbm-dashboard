import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Tooltip } from 'antd';
import { PlusOutlined, InfoCircleOutlined, FilterOutlined } from '@ant-design/icons';
import { 
    Chart,
} from 'chart.js'


const TimeSeriesView: React.FC = () => {
    const { sensorId } = useParams<{ sensorId: string }>();
    const sensorProps = useSelector((state: RootState) => state.sensors.sensorProps);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const chartWidth = window.innerWidth * 0.8; // 80% of window width
    const chartHeight = window.innerHeight * 0.6;
    const chartRef = useRef<HTMLCanvasElement>(null);
    const [chart, setChart] = useState<Chart | null>(null);

    useEffect(() => {
        const canvas = chartRef.current;
        let newChart = null;
    
        if (canvas) {
            newChart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: [], // This will be updated with the time values from the fetched data
                    datasets: [{
                        label: 'temperature',
                        data: [], // This will be updated with the temperature values from the fetched data
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: 'minute',
                                displayFormats: {
                                    'millisecond': 'HH:mm:ss EEE dd MMM',
                                    'second': 'HH:mm:ss EEE dd MMM',
                                    'minute': 'HH:mm:ss EEE dd MMM',
                                    'hour': 'HH:mm:ss EEE dd MMM',
                                    'day': 'HH:mm:ss EEE dd MMM',
                                    'week': 'HH:mm:ss EEE dd MMM',
                                    'month': 'HH:mm:ss EEE dd MMM',
                                    'quarter': 'HH:mm:ss EEE dd MMM',
                                    'year': 'HH:mm:ss EEE dd MMM',
                                }
                            },
                            ticks: {
                                callback: function(value, index, values) {
                                    return new Date(values[index].value).toLocaleString('en-US', { hour12: false, weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                                }
                            }
                        }],
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            setChart(newChart);
        }
    
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/sensors/stream-timeseries/${sensorId}/hour`);
                const reader = response.body.getReader();
                let chunks = '';
    
                while (true) {
                    const { done, value } = await reader.read();
    
                    if (done) {
                        break;
                    }
    
                    chunks += new TextDecoder("utf-8").decode(value);
    
                    if (chunks.endsWith('\n')) {
                        const message = chunks.slice(0, -1);
                        chunks = '';
    
                        if (message.startsWith('data: ')) {
                            const data = JSON.parse(message.slice(6)); // Remove 'data: '
                            console.log('Received data:', data);
                            // Update the chart data
                            if (newChart) {
                                data.forEach(item => {
                                    newChart.data.labels.push(new Date(item.time)); // convert time string to Date object
                                    newChart.data.datasets.forEach((dataset) => {
                                        console.log("DATASE LABEL: ", dataset.label);
                                        console.log("ITEM TYPE: ", item.type);
                                        if (dataset.label === item.type) { // match the dataset label with the data type
                                            if (!dataset.data.includes(item.data)) {
                                                dataset.data.push(item.data); // add the data value to the dataset
                                            }
                                        }
                                    });
                                });
                                newChart.update();
                            } else {
                                console.log('No chart found');
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Fetch request failed:', error);
            }
        };
    
        if (newChart) {
            fetchData();
        }
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px'}}>
                        <h3 style={{ marginRight: '10px' }}>Sensor: {sensorId}</h3>
                        <Tooltip title="More Info" onClick={() => setModalIsOpen(true)}>
                            <InfoCircleOutlined />
                        </Tooltip>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<PlusOutlined />} 
                            style={{ marginLeft: '500px' }}
                        >
                            Add
                        </Button>
                        <div style={{ marginLeft: '10px' }}>
                        <Button 
                            variant="contained" 
                            startIcon={<FilterOutlined />} 
                            sx={{ bgcolor: 'grey.500', color: 'white' }}
                        >
                            Scope
                        </Button>
                        </div>
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
                    <canvas ref={chartRef} width={chartWidth} height={chartHeight} />
                </div>
            </div>
        </div>
    );
};

export default TimeSeriesView;