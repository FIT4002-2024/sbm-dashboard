import { configureStore } from '@reduxjs/toolkit'
import sensorSlice from './sensors'

export default configureStore({
    reducer: {
        sensors: sensorSlice
    }
}) 