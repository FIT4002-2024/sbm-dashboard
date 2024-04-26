import React, { useState, useEffect, useRef } from "react";
import { Carousel, Button } from "antd";

import SensorGrid from "../components/operations/SensorGrid";

/**
 * OperationsPage component
 * This component is responsible for rendering the Operations page and manages the connection to a Server-Sent Events (SSE) endpoint to stream sensor data.
 */

const contentStyle: React.CSSProperties = {
    margin: 0,
    height: '70vh',
    width: '90vw',
    lineHeight: '160px',
    textAlign: 'center',
};

const buttonContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)', // Center the button horizontally
};

interface SensorDataType {
    factoryName: string;
    sensorId: string;
    sensorType: string;
    currentValue: number;
    unit: string;
    highValue: number;
    lowValue: number;
}

interface IncomingSensorData {
    _id: string;
    time: string;
    type: string;
    sensorId: string;
    units: string;
    data: number;
    __v: number;
}

const OperationsPage: React.FC = () => {
    const carouselRef = useRef<HTMLDivElement | null>(null);  // Ref for accessing the Carousel component
    const [sensorData, setSensorData] = useState<SensorDataType[]>([]); // State to store the sensor data fetched from the backend
    const eventSourceRef = useRef<EventSource | null>(null); // Ref to hold the SSE connection

    useEffect(() => {
        // URL of the SSE endpoint
        const sseUrl = 'http://localhost:4000/api/sensors/stream-immediate';

        console.log("Attempting to connect to SSE at:", sseUrl);
        // Initialize the SSE connection to the backend
        eventSourceRef.current = new EventSource(sseUrl);

        // Event handler for incoming SSE messages
        eventSourceRef.current.onmessage = (event: MessageEvent) => {

            const newData: IncomingSensorData[] = JSON.parse(event.data);
            console.log("Received sensor data:", newData);
            // Update state by either adding a new sensor or updating an existing one
            setSensorData(currentData => {
                const updatedData = newData.map((item) => ({
                    factoryName: "Factory 1",
                    sensorId: item.sensorId,
                    sensorType: item.type || "N/A",
                    currentValue: item.data ?? "N/A",
                    unit: item.units || "N/A",
                    highValue: 70, // Example static value
                    lowValue: 50   // Example static value
                }));
                console.log("Updated sensor data:", updatedData);
                return updateSensorData(currentData, updatedData);
            });
        };

        eventSourceRef.current.onopen = () => {
            console.log('Connected');
        };
        eventSourceRef.current.onerror = () => {
            console.log('Disconnected. Reconnecting...');
        };

        // Cleanup function to close the SSE connection when the component unmounts
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close(); // Close the connection
            }
        };
    }, []);

    // Function to update sensor data by type
    const updateSensorData = (currentData: SensorDataType[], newData: SensorDataType[]) => {
        const dataMap = new Map(currentData.map(sensor => [sensor.sensorId, sensor]));

        // Update existing entries or add new ones
        newData.forEach(sensor => {
            dataMap.set(sensor.sensorId, sensor);
        });

        return Array.from(dataMap.values());
    };

    const handleSensorClick = (factoryName: string, sensorId: string) => {
        const nextSlideIndex = calculateNextSlideIndex(factoryName as string, sensorId as string);
        if (carouselRef.current) {
            carouselRef.current.goTo(nextSlideIndex);
        }
    };

    const handleBackButtonClick = () => {
        if (carouselRef.current) {
            const currentSlideIndex = carouselRef.current.innerSlider.state.currentSlide;
            carouselRef.current.goTo(currentSlideIndex - 1); // Go to the next slide
        }
    };

    const calculateNextSlideIndex = (factoryName: string, sensorType: string): number => {
        // Define your logic to determine the slide index based on factoryName and sensorType
        // For demonstration, let's assume simple mappings
        const slideIndexMap: Record<string, number> = {
            "Factory 1-Temperature Sensor": 1,
            "Factory 2-Pressure Sensor": 1,
            "Factory 1-Humidity Sensor": 1,
            // Add more mappings as needed
        };

        const key = `${factoryName}-${sensorType}`;
        return slideIndexMap[key] || 0; // Default to the first slide if no match
    };

    const onChange = (current: number) => {
        console.log(`Current slide index: ${current}`);
    };

    return (
        <div>
            <div style={{}}>
                <h1>Operations</h1>
            </div>
            <Carousel
                afterChange={onChange}
                style={{ marginTop: '20px' }}
                dotPosition="bottom"
                ref={carouselRef}
            >
                <div>
                    <h3 style={contentStyle}>
                        <SensorGrid sensorData={sensorData} onSensorClick={handleSensorClick} />
                    </h3>
                </div>
                <div style={{ position: 'relative' }}>
                    <h3 style={contentStyle}>
                        Sensor Information - Graph goes here
                    </h3>
                    <div style={buttonContainerStyle}>
                        <Button onClick={handleBackButtonClick}>
                            Back
                        </Button>
                    </div>
                </div>
            </Carousel>
        </div>
    );
};

export default OperationsPage;
