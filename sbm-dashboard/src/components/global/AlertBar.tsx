import React from "react";
import AlertNotification from '../alerts/AlertNotification';


interface AlertBarProps {
    collapsed: boolean;
}

const AlertBar: React.FC<AlertBarProps> = ({ collapsed }) => {
    // Sample alert notifications
    const alerts = [
        { sensorId: '1', type: 'Temperature', msg: 'warning' },
        { sensorId: '2', type: 'Humidity', msg: 'out of range' },
        { sensorId: '3', type: 'Connection', msg: 'offline' },
    ];

    return (
        <div className="alert-bar">
            {collapsed ? <h2>Alerts</h2> : <h1>Alerts</h1>}
            {alerts.map(alert => (
                <AlertNotification
                    key={alert.sensorId}
                    collapsed={collapsed}
                    sensorId={alert.sensorId}
                    type={alert.type}
                    msg={alert.msg}
                />
            ))}
        </div>
    );
};

export default AlertBar;
