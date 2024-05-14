import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Flex } from "antd";
import React, { useEffect, useState } from "react";
interface sensorAlertProps {
  id: number;
  message: string;
  hiValue: number;
  loValue: number;
  suggestionAction: string;
}
interface AlertAddingInSensorProps {
  id: number;
  onInputChange: (arg: sensorAlertProps) => void;
}

const AlertAddingInSensor: React.FC<AlertAddingInSensorProps> = (
  addingAlertProps: AlertAddingInSensorProps
) => {
  const { id, onInputChange } = addingAlertProps;
  const [alertData, setAlertData] = useState<sensorAlertProps>({
    id: id,
    message: "",
    hiValue: 0,
    loValue: 0,
    suggestionAction: "",
  });

  const handleChange = (name: string, value: string) => {
    setAlertData({ ...alertData, [name]: value });
    console.log(alertData);
  };
  return (
    <div className="adding-alert-in-sensor" style={{ margin: "1ch" }}>
      <div style={{ display: "Flex" }}>
        <TextField
          id="alert-label"
          label="Alert Message"
          fullWidth
          onChange={(e) => handleChange("message", e.target.value)}
        />
      </div>
      <br></br>
      <div style={{ display: "Flex" }}>
        <TextField
          fullWidth
          id="alert-value"
          type="number"
          label="Alert Low Value"
          onChange={(e) => handleChange("loValue", e.target.value)}
        />

        {/* <FormControl sx={{ width: "10ch", paddingRight: "1ch" }}>
          <InputLabel id="select-sensor-type-label">Check</InputLabel>
          <Select
            labelId="select-sensor-typ-label"
            id="sensor-type-select"
            label="Sensor Type"
          >
            {comparation.map((comparationType) => (
              <MenuItem value={comparationType}>{comparationType}</MenuItem>
            ))}
          </Select>
        </FormControl> */}
        <TextField
          fullWidth
          type="number"
          id="alert-value"
          label="Alert High Value"
          onChange={(e) => handleChange("hiValue", e.target.value)}
        />
      </div>
      <br></br>

      <div style={{ display: "Flex" }}>
        <TextField
          id="alert-action"
          label="Alert Suggestion Action"
          fullWidth
          onChange={(e) => handleChange("suggestionAction", e.target.value)}
        />
      </div>
    </div>
  );
};

export default AlertAddingInSensor;
