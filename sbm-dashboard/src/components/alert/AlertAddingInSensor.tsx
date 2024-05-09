import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Flex } from "antd";
import React from "react";

const AlertAddingInSensor: React.FC = () => {
  const comparation = ["<", ">", "<=", ">=", "==", "!="];

  return (
    <div className="adding-alert-in-sensor" style={{ margin: "1ch" }}>
      <div style={{ display: "Flex" }}>
        <TextField id="alert-label" label="Alert Message" fullWidth />
      </div>
      <br></br>
      <div style={{ display: "Flex" }}>
        <TextField fullWidth id="alert-value" label="Alert Low Value" />

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
        <TextField fullWidth id="alert-value" label="Alert High Value" />
      </div>
      <br></br>

      <div style={{ display: "Flex" }}>
        <TextField
          id="alert-action"
          label="Alert Suggestion Action"
          fullWidth
        />
      </div>
    </div>
  );
};

export default AlertAddingInSensor;
