import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Select, MenuItem, DialogActions, Button } from '@mui/material';

interface AddSensorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddSensorModal: React.FC<AddSensorModalProps> = ({ isOpen, onClose }) => {
    const [sensorIds, setSensorIds] = useState<string[]>([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/sensors/')
            .then(response => response.json())
            .then(data => setSensorIds(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Add a Sensor</DialogTitle>
            <DialogContent>
                <Select>
                    {sensorIds.map((id) => (
                        <MenuItem key={id} value={id}>{id}</MenuItem>
                    ))}
                </Select>
            </DialogContent>
        </Dialog>
    );
};

export default AddSensorModal;