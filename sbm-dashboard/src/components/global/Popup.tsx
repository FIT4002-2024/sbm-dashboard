import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";

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
      <Dialog open={openPopup}>
        <DialogTitle style={{ width: "400px" }}>
          <div style={{ display: "flex" }}>
            <div style={{ flexGrow: "1" }}>{title}</div>
            <CloseIcon onClick={() => setOpenPopup(false)}></CloseIcon>
          </div>
        </DialogTitle>
        <DialogContent dividers style={{ width: "400px" }}>
          {popupContent}
          <br />
          <div
            style={{ marginTop: "5px", marginRight: "2px", textAlign: "right" }}
          ></div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Popup;
