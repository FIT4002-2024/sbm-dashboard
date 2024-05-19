import React from "react";
import { WarningFilled, ExclamationCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { Card } from "antd";
import './AlertNotification.css';


interface AlertNotificationProps {
    collapsed: boolean;
    sensorId: string;
    type: string;
    msg: string;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({ collapsed, sensorId, msg, type }) => {
    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'warning':
                return <WarningFilled style={{ color: '#ff0000' }} />;
            case 'out of range':
                return <ExclamationCircleFilled style={{ color: '#ffa800' }} />;
            case 'offline':
                return <QuestionCircleFilled style={{ color: '#00a3ff' }} />;
            default:
                return null;
        }
    };

    return (
        <div className="alert-notification">
            <span>{getIcon(msg)}</span>
            <div className="alert-message">Sensor: {sensorId}</div>
            <div className="alert-message"> {msg} </div>
        </div>
    );
};

export default AlertNotification;
