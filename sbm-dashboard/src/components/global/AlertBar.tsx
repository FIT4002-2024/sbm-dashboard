import React, { useState, useEffect, useRef } from "react";
import AlertNotification from '../alerts/AlertNotification';
import AlertNotificationCollapsed from "../alerts/AlertNotificationCollapsed";
import { Button } from "antd";

interface AlertBarProps {
    collapsed: boolean;
}

interface AlertData {
    alertId: string;
    sensorId: string;
    type: string;
    msg: string;
    fix: string;
}

interface IncomingAlertData {
    alertId: string;
    sensorId: string;
    type: string;
    msg: string;
    fix: string;
}

const AlertBar: React.FC<AlertBarProps> = ({ collapsed }) => {
    // Sample alert notifications
    const [alertData, setAlertData] = useState<AlertData[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        const sseUrl = 'http://localhost:4000/api/alerts/';

        eventSourceRef.current = new EventSource(sseUrl);

        eventSourceRef.current.onopen = () => {
            console.log("SSE connection established");
        };

        eventSourceRef.current.onerror = (error) => {
            console.error("SSE connection error: ", error);
        };

        eventSourceRef.current.onmessage = (event: MessageEvent) => {
            const newData: IncomingAlertData[] = JSON.parse(event.data);
            console.log("Received new alert data: ", newData);

            setAlertData((currentData) => updateAlertData(currentData, newData));
        };

        return () => {
            console.log("Closing SSE connection");
            eventSourceRef.current?.close();
        };
    }, []);

    const updateAlertData = (currentData: AlertData[], newData: AlertData[]) => {
        const dataMap = new Map(currentData.map(alert => [alert.alertId, alert]));

        newData.forEach(alert => {
            dataMap.set(alert.alertId, alert);
        });

        return Array.from(dataMap.values());
    };

    return (
        <div className="alert-bar">
            {collapsed ? <h2>Alerts</h2> : <h1>Alerts</h1>}

            {collapsed ?
                alertData.map(alert => (
                    <AlertNotificationCollapsed
                        key={alert.alertId}
                        collapsed={collapsed}
                        sensorId={alert.sensorId}
                        type={alert.type}
                        msg={alert.msg}
                    />
                )) :
                alertData.map(alert => (
                    <Button type="link" key={alert.alertId} style={{ maxWidth: 200, height: 0 }} onClick={() => alert.fix}>
                        <AlertNotification
                            key={alert.sensorId}
                            collapsed={collapsed}
                            sensorId={alert.sensorId}
                            type={alert.type}
                            msg={alert.msg}
                        />
                    </Button>
                ))
            }
        </div>
    );
};

export default AlertBar;
