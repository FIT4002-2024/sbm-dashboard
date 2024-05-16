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
    const chartRef = useRef(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const scope = 'day';
    //         try{
    //             const response = await fetch(`/api/sensors/stream-timeseries/${sensorId}/${scope}`);
    //             const text = await response.text();
    //             console.log('Response text:', text);

    //             if (!response.ok) {
    //                 console.error('Fetch request failed:', response);
    //                 return;
    //             }
        
    //             const data = JSON.parse(text);
    //             console.log('DATA: ', data);
        
    //             if (Array.isArray(data)) {
    //                 setChartData({
    //                     labels: data.map(reading => reading.timestamp),
    //                     datasets: [{
    //                         label: 'Sensor Readings',
    //                         data: data.map(reading => reading.value),
    //                         fill: false,
    //                         backgroundColor: 'rgb(75, 192, 192)',
    //                         borderColor: 'rgba(75, 192, 192, 0.2)',
    //                     }],
    //                 });
    //             }
    //         } catch (error) {
    //             console.error('Fetch request failed:', error);
    //         }
    //     };

    //     fetchData();
    // }, [sensorId]);

    useEffect(() => {
        if (chartRef && chartRef.current) {
            const chartInstance = new Chart(chartRef.current, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: '',
                        data: [],
                        fill: false,
                        backgroundColor: 'rgb(75, 192, 192)',
                        borderColor: 'rgba(75, 192, 192, 0.2)',
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    }, []);

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