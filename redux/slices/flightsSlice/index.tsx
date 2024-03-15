// Import the createSlice API from Redux Toolkit
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import { Flight } from "./types";

type Nullable<T> = T | undefined | null;

type FlightState = {
  flightsArray: Array<Flight>;
  currentFlightId: Nullable<string>;
};
const initialState: FlightState = {
  flightsArray: [],
  currentFlightId: null,
};

export const flightsSlice = createSlice({
  name: "flights",
  initialState: initialState,
  reducers: {
    setCurrentFlightById: (state, { payload }: PayloadAction<string>) => {
      state.currentFlightId = payload;
    },

    createFlight: (state, { payload }: PayloadAction<Flight>) => {
      state.currentFlightId = null;

      state?.flightsArray.push({
        ...payload,
        flightId: payload?.flightNumber + uuid.v4(),
      });
      console.log(
        "new flight created",
        "payload:",
        payload,
        "redux state:",
        state.flightsArray
      );
    },

    updateFlight: (state, { payload }: PayloadAction<Flight>) => {
      state.flightsArray = state.flightsArray.map((f) => {
        if (f.flightId === payload?.flightId) {
          return payload;
        }

        return f;
      });

      state.currentFlightId = payload?.flightId;
    },
    removeFlight: (state, { payload }: PayloadAction<string>) => {
      state.currentFlightId = null;
      state.flightsArray = state.flightsArray.filter(
        (flight) => flight?.flightId !== payload
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  removeFlight,
  setCurrentFlightById,
  createFlight,
  updateFlight,
} = flightsSlice.actions;

// We export the reducer function so that it can be added to the store
export default flightsSlice.reducer;
