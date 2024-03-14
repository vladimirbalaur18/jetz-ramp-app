// Import the createSlice API from Redux Toolkit
import { ProvidedServices } from "@/redux/types";
import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
// This is the initial state of the slice

const initialState: ProvidedServices = [
  // {
  //   serviceTypeName: "Basic handling",
  //   services: [
  //     {
  //       serviceName: "Marshalling",
  //       quantity:
  //     },
  //   ],
  // },
];

export const servicesSlice = createSlice({
  name: "services", // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = servicesSlice.actions;

// We export the reducer function so that it can be added to the store
export default servicesSlice.reducer;
