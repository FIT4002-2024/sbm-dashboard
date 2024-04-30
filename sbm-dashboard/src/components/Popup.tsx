import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

interface PopupProps {
  title: string;
  children: React.ReactNode;
  openPopup: () => void;
  setOpenPopup: (value: boolean) => void;
}

const Popup: React.FC<PopupProps> = (props: PopupProps) => {
  const { title, children, openPopup, setOpenPopup } = props;
  return (
    <div>
      <Dialog open={{ openPopup }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </div>
  );
};

export default Popup;
