import { configureStore } from "@reduxjs/toolkit";
import flightsReducer from "./slices/flightsSlice";
import configsReducer from "./slices/configSlice";
export const store = configureStore({
  reducer: {
    flights: flightsReducer,
    configs: configsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
