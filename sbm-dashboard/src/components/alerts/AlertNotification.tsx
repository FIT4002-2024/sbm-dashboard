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

const AlertNotification: React.FC<AlertNotificationProps> = ({ collapsed, sensorId, msg }) => {
    const getIcon = (msg: string) => {
        switch (msg.toLowerCase()) {
            case 'warning':
                return <WarningFilled style={{ color: 'red' }} />;
            case 'out of range':
                return <ExclamationCircleFilled style={{ color: 'yellow' }} />;
            case 'offline':
                return <QuestionCircleFilled style={{ color: 'cyan' }} />;
            default:
                return null;
        }
    };

    return (
        <div className="alert-notification">
                <span>{getIcon(msg)}</span>
                {!collapsed && <div className="alert-message">Sensor: {sensorId} - {msg}</div>}
        </div>
    );
};

export default AlertNotification;
