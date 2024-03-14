// Import the createSlice API from Redux Toolkit
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { Flight } from "./types";
// This is the initial state of the slice
type Nullable<T> = T | undefined | null;

type FlightState = {
  flightsArray: Array<Flight>;
  currentFlight: Nullable<Flight>;
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
      state.currentFlight = state.flightsArray.find(
        (f) => f.flightId === payload
      );
    },
    pushArrivalInformation: (state, { payload }: PayloadAction<Flight>) => {
      state.currentFlight = payload;

      if (state?.currentFlight?.flightId === payload?.flightId) {
        state.flightsArray = state?.flightsArray.map((f) => {
          if (f.flightId === payload?.flightId) {
            return payload;
          }

          return f;
        });
      }
      state.flightsArray.push({
        ...payload,
        flightId:
          payload?.flightNumber +
          "-" +
          payload.arrival?.arrivalDate.toISOString() +
          Date.now(),
      });
    },
    removeFlight: (state, { payload }: PayloadAction<string>) => {
      state.flightsArray = state.flightsArray.filter(
        (flight) => flight?.flightId !== payload
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { pushArrivalInformation, removeFlight, setCurrentFlightById } =
  flightsSlice.actions;

// We export the reducer function so that it can be added to the store
export default flightsSlice.reducer;
