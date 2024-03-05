import { configureStore } from "@reduxjs/toolkit";
import flightsReducer from "./slices/flightsSlice";
export const store = configureStore({
  reducer: {
    flights: flightsReducer,
  },
});
