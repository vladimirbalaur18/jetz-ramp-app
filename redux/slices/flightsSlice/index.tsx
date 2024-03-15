// Import the createSlice API from Redux Toolkit
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import { Flight } from "./types";

type Nullable<T> = T | undefined | null;

type FlightState = {
  flightsArray: Array<Flight>;
  currentFlight: Nullable<string>;
};
const initialState: FlightState = {
  flightsArray: [],
  currentFlight: null,
};

export const flightsSlice = createSlice({
  name: "flights", // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    setCurrentFlightById: (state, { payload }: PayloadAction<string>) => {
      state.currentFlight = payload;
    },

    createFlight: (state, { payload }: PayloadAction<Flight>) => {
      state.currentFlight = null;

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

      state.currentFlight = payload?.flightId;
    },
    removeFlight: (state, { payload }: PayloadAction<string>) => {
      state.currentFlight = null;
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
