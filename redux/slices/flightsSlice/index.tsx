// Import the createSlice API from Redux Toolkit
import { Flight } from "@/redux/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";

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

    removeCurrentFlightById: (state) => {
      state.currentFlightId = null;
    },
    createFlight: (state, { payload }: PayloadAction<Flight>) => {
      const id = payload?.flightNumber + uuid.v4();
      state.currentFlightId = id;
      state?.flightsArray.push({
        ...payload,
        flightId: id,
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
      state.currentFlightId = payload?.flightId;
      state.flightsArray = state.flightsArray.map((f) => {
        if (f.flightId === payload?.flightId) {
          return payload;
        }

        return f;
      });
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
  removeCurrentFlightById,
} = flightsSlice.actions;

// We export the reducer function so that it can be added to the store
export default flightsSlice.reducer;
