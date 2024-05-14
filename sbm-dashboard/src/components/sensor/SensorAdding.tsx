import {
  Autocomplete,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  formControlClasses,
  FormControl,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import AlertAddingInSensor from "../alert/AlertAddingInSensor";
interface sensorAlertProps {
  id: number;
  message: string;
  hiValue: number;
  loValue: number;
  suggestionAction: string;
}

const SensorAdding = () => {
  const sensorIDList = ["1", "2", "3"];
  const locationList = ["Location 1", "Location 2", "Location 3"];
  const sensorTypeList = ["Temperature", "Humanity"];

  const [alerts, setAlerts] = useState([0]);
  const [alertData, setAlertData] = useState<sensorAlertProps[]>([]);
  const [addingFormData, setAddingFormData] = React.useState({
    sensorId: "",
    type: "",
    name: "",
    location: "",
    alerts: alertData,
  });

  const addAlert = (newAlert: sensorAlertProps) => {
    setAlerts((prevAlerts) => [...prevAlerts, prevAlerts.length]);
    var Alertdata: sensorAlertProps = {
      id: alertData.length,
      message: "",
      hiValue: 0,
      loValue: 0,
      suggestionAction: "",
    };
    setAlertData((prevAlerts) => [...prevAlerts, Alertdata]);
  };

  const removeAlert = (index: number) => {
    setAlertData((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  };

  const handleChange = (name: string, value: string) => {
    console.log(name, value);

    // const { name, value } = event.target;
    setAddingFormData({ ...addingFormData, [name]: value });
    console.log(addingFormData);
  };
  const handleAlertChange = (newAlert: sensorAlertProps) => {
    setAlertData((prevAlerts) => [
      ...prevAlerts.filter((alert) => alert.id !== newAlert.id),
      newAlert,
    ]);
  };

  return (
    <div className="sensor-adding-popup">
      <form style={{ margin: "auto" }}>
        <Autocomplete
          fullWidth
          disablePortal
          id="select-sensor"
          options={sensorIDList}
          renderInput={(params) => (
            <TextField {...params} label="Sensor" value={params} />
          )}
          //   value={addingFormData.sensorId}
          //   onChange={(_, value) => handleChange("sensorId", value ?? "")}
        />
        <br></br>
        <FormControl fullWidth>
          <InputLabel id="select-sensor-type-label">Sensor Type</InputLabel>
          <Select
            labelId="select-sensor-typ-label"
            id="sensor-type-select"
            label="Sensor Type"
          >
            {sensorTypeList.map((sensorType) => (
              <MenuItem value={sensorType}>{sensorType}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <br></br>
        <br></br>
        <TextField fullWidth id="sensor-label" label="Sensor Label" />
        <br></br>
        <br></br>
        <Autocomplete
          freeSolo
          fullWidth
          disablePortal
          id="select-location"
          options={locationList}
          renderInput={(params) => (
            <TextField {...params} label="Location" value={params} />
          )}
          //   value={addingFormData.sensorId}
          //   onChange={(_, value) => handleChange("sensorId", value ?? "")}
        />
        <br></br>
        <div>
          <b>Adding Alert</b>
        </div>
        <div style={{ margin: "1ch" }}>
          {alerts.map((_, index) => (
            <div>
              <div style={{ display: "flex" }}>
                <div style={{ flexGrow: 1 }}>Alert: {index + 1}</div>
                <a
                  type="button"
                  onClick={() => removeAlert(index)} // Wrap removeAlert function call in an arrow function
                  style={{ marginRight: "1ch", color: "red" }}
                >
                  Remove Alert
                </a>
              </div>
              <AlertAddingInSensor key={index} handleChan />
            </div>
          ))}
          <div style={{ display: "Flex" }}>
            <a type="button" onClick={addAlert}>
              Add New Alert
            </a>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <button type="submit">Add Sensor</button>
      </form>
    </div>
  );
};

export default SensorAdding;
