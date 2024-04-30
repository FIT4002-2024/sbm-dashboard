import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

interface PopupProps {
  title: string;
  popupContent: React.ReactNode;
  openPopup: boolean;
  setOpenPopup: (value: boolean) => void;
}

const Popup: React.FC<PopupProps> = (props: PopupProps) => {
  const { title, popupContent, openPopup, setOpenPopup } = props;
  return (
    <div>
      <Dialog open={openPopup} style={{ textAlign: "center" }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers style={{ width: "300px" }}>
          {popupContent}
          <br />
          <div style={{ marginTop: "5px" }}>
            <button onClick={() => setOpenPopup(false)}>Cancel</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Popup;
