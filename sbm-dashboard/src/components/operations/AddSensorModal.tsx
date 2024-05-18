import React from 'react';
import { Dialog, DialogTitle, DialogContent, Select, MenuItem, DialogActions, Button } from '@mui/material';

interface AddSensorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddSensorModal: React.FC<AddSensorModalProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Add a Sensor</DialogTitle>
            <DialogContent>
                <Select>
                    <MenuItem value="sensor1">Sensor 1</MenuItem>
                    <MenuItem value="sensor2">Sensor 2</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddSensorModal;