import {
  Autocomplete,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  // formControlClasses,
  FormControl,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
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

  const [alerts, setAlerts] = useState<sensorAlertProps[]>([]);
  const [addingFormData, setAddingFormData] = React.useState({
    sensorId: sensorIDList[0],
    type: sensorTypeList[0],
    name: "",
    location: "",
    alerts: alerts,
  });

  const addAlert = () => {
    var Alert: sensorAlertProps = {
      id: alerts.length,
      message: "",
      hiValue: 0,
      loValue: 0,
      suggestionAction: "",
    };
    setAlerts((prevAlerts) => [...prevAlerts, Alert]);
  };

  const removeAlert = (index: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  };

  const handleChange = (name: string, value: string) => {
    setAddingFormData({ ...addingFormData, [name]: value });
  };
  const handleAlertChange = (newAlert: sensorAlertProps) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts.filter((alert) => alert.id !== newAlert.id),
      newAlert,
    ]);
  };
  useEffect(() => {
    setAddingFormData((prevData) => ({ ...prevData, alerts: alerts }));
  }, [alerts, addingFormData]);

  const onSubmit = () => {
    event.preventDefault();

    console.log(addingFormData);
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
          value={addingFormData.sensorId}
          onChange={(_, value) =>
            handleChange("sensorId", value ?? sensorIDList[0])
          }
        />
        <br></br>
        <FormControl fullWidth>
          <InputLabel id="select-sensor-type-label">Sensor Type</InputLabel>
          <Select
            labelId="select-sensor-typ-label"
            id="sensor-type-select"
            label="Sensor Type"
            value={addingFormData.type || sensorTypeList[0]}
            onChange={(event: SelectChangeEvent) =>
              handleChange("alert", event.target.value as string)
            }
          >
            {sensorTypeList.map((sensorType) => (
              <MenuItem value={sensorType}>{sensorType}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <br></br>
        <br></br>
        <TextField
          fullWidth
          id="sensor-label"
          label="Sensor Label"
          value={addingFormData.name || ""}
          onChange={(event) => handleChange("name", event.target.value)}
        />
        <br></br>
        <br></br>
        <Autocomplete
          freeSolo
          fullWidth
          disablePortal
          id="select-location"
          options={locationList}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Location"
              value={params}
              onChange={(event) => handleChange("name", event.target.value)}
            />
          )}
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
                  style={{ marginRight: "1ch", color: "red" }}
                  onClick={() => removeAlert(index)}
                >
                  Remove Alert
                </a>
              </div>
              <AlertAddingInSensor
                key={index}
                id={index}
                onInputChange={handleAlertChange}
              />
            </div>
          ))}
          <div style={{ display: "Flex" }}>
            <a type="button" onClick={() => addAlert()}>
              Add New Alert
            </a>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <button type="submit" onClick={onSubmit}>
          Add Sensor
        </button>
      </form>
    </div>
  );
};

export default SensorAdding;
