// Import the createSlice API from Redux Toolkit
import { IFlight } from "@/models/Flight";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";

type Nullable<T> = T | undefined | null;

type FlightState = {
  flightsArray: Array<IFlight>;
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
    createFlight: (state, { payload }: PayloadAction<IFlight>) => {
      const id = payload?.flightNumber + uuid.v4();
      state.currentFlightId = id;
      state?.flightsArray.push({
        ...payload,
        flightId: id,
      });
    },

    updateFlight: (state, { payload }: PayloadAction<IFlight>) => {
      state.currentFlightId = payload?.flightId;
      state.flightsArray = [
        ...state.flightsArray.map((f) => {
          if (f.flightId === payload?.flightId) {
            return { ...state, ...payload };
          }

          return f;
        }),
      ];
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
