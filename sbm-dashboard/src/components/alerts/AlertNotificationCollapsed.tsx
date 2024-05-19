import React from "react";
import { WarningFilled, ExclamationCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import './AlertNotification.css';


interface AlertNotificationProps {
    collapsed: boolean;
    sensorId: string;
    type: string;
    msg: string;
}

const AlertNotificationCollapsed: React.FC<AlertNotificationProps> = ({ sensorId, type, msg }) => {
    const getIcon = (msg: string) => {
        switch (msg.toLowerCase()) {
            case 'critical':
                return <WarningFilled style={{ color: '#ff0000' }} />;
            case 'warning':
                return <ExclamationCircleFilled style={{ color: '#ffa800' }} />;
            case 'info':
                return <QuestionCircleFilled style={{ color: '#00a3ff' }} />;
            default:
                return null;
        }
    };

    return (
        <div className="alert-notification">
                <span>{getIcon(msg)}</span>
        </div>
    );
};

export default AlertNotificationCollapsed;
