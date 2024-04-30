import { useState } from "react";
import Popup from "../components/Popup";
import SensorPopup from "../components/SensorPopup";
function OperationsPage() {
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <div>
      Content for Operations
      <button onClick={() => setOpenPopup(true)}>Open Popup</button>
      <Popup
        title="Popup Title"
        openPopup={openPopup}
        setOpenPopup={(value: boolean) => setOpenPopup(value)}
        popupContent={
          <SensorPopup
            name="Temperature Sensor"
            value={10}
            date="10/31/2024"
            time="12:00"
            suggestionAction="Check the sensor"
          ></SensorPopup>
        }
      ></Popup>
    </div>
  );
}

export default OperationsPage;
