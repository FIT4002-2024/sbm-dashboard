import { useState } from "react";
import Popup from "../components/Popup";
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
        popupContent={<div>Popup Content</div>}
      ></Popup>
    </div>
  );
}

export default OperationsPage;
