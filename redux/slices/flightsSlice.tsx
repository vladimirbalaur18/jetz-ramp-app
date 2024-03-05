// Import the createSlice API from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
// This is the initial state of the slice
const initialState = {
  flightsArray: [
    {
      callsign: "YR-ATA",
      date: dayjs("2024-03-05"),
      departure: "KIV",
      arrival: "RMO",
    },
    {
      callsign: "YR-ATA",
      date: dayjs("2024-03-04"),
      departure: "KIV",
      arrival: "RMO",
    },

    {
      callsign: "YR-ATB",
      date: dayjs("2024-03-04"),
      departure: "KIV",
      arrival: "RMO",
    },
    {
      callsign: "YR-ATC",
      date: dayjs("2024-03-04"),
      departure: "KIV",
      arrival: "RMO",
    },
    {
      callsign: "YR-ATC",
      date: dayjs("2024-02-01"),
      departure: "KIV",
      arrival: "RMO",
    },
  ],
};

export const flightsSlice = createSlice({
  name: "flights", // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = flightsSlice.actions;

// We export the reducer function so that it can be added to the store
export default flightsSlice.reducer;
