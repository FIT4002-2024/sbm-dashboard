import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Select, MenuItem, DialogActions, Button, Box } from '@mui/material';

interface AddSensorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (id: string) => void;
}

const AddSensorModal: React.FC<AddSensorModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [sensorIds, setSensorIds] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');

    useEffect(() => {
        fetch('http://localhost:4000/api/sensors/')
            .then(response => response.json())
            .then(data => setSensorIds(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleAdd = () => {
        onAdd(selectedId);
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <Box>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Box>
            <Box display="flex" justifyContent="center" marginTop={2}>
                <DialogTitle>Sensors Available:</DialogTitle>
            </Box>
            <DialogContent>
                <Select fullWidth value={selectedId} onChange={(e) => setSelectedId(e.target.value as string)}>
                    {sensorIds.map((id) => (
                        <MenuItem key={id} value={id}>{id}</MenuItem>
                    ))}
                </Select>
                <Box display="flex" justifyContent="center" marginTop={2}>
                    <Button variant="contained" color="success" onClick={handleAdd}>
                        Add
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AddSensorModal;