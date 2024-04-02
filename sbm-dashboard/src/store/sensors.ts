import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Sensor {
  id: number;
  location: string;
  type: string;
  name: string;
  value: number;
  high: number;
  low: number;
}

const initialState: Sensor[] = [];

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    addSensor(state, action: PayloadAction<Sensor>) {
        state.push(action.payload);
    },
    selectSensor(state, action: PayloadAction<number>) {
        return state.filter((sensor) => sensor.id === action.payload);
    },
    getAllSensors(state) {
        return state;
    }
  },
});

export const { addSensor } = sensorsSlice.actions;

export default sensorsSlice.reducer;
