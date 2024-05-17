import React from "react";

interface sensorAlertProps {
  name: string;
  value: number;
  date: string;
  time: string;
  suggestionAction: string;
}

const SensorAlert: React.FC<sensorAlertProps> = (props: sensorAlertProps) => {
  const { name, value, date, time, suggestionAction } = props;

  return (
    <div className="sensor-popup">
      <div style={{ display: "flex" }}>Name: {name}</div>
      <div style={{ display: "flex" }}>Value read: {value}</div>
      <div style={{ display: "flex" }}>On: {date}</div>
      <div style={{ display: "flex" }}>At: {time}</div>
      <div>Suggestion Action: {suggestionAction}</div>
    </div>
  );
};

export default SensorAlert;
