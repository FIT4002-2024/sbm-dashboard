import { configureStore } from '@reduxjs/toolkit'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SensorProps } from './SensorInstance';

interface SensorState {
    sensorProps: SensorProps;
}

const initialState: SensorState = {
    sensorProps: {
        factoryName: '',
        sensorId: '',
        sensorType: '',
        currentValue: 0,
        unit: '',
        highValue: 0,
        lowValue: 0,
    },
};

const sensorSlice = createSlice({
    name: 'sensors',
    initialState,
    reducers: {
        setSensorProps(state, action: PayloadAction<SensorProps>) {
            state.sensorProps = action.payload;
        },
    },
});

export const { setSensorProps } = sensorSlice.actions;

const store = configureStore({
    reducer: {
        sensors: sensorSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;