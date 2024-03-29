import { configureStore } from "@reduxjs/toolkit";
import flightsReducer from "./slices/flightsSlice";
import servicesReducer from "./slices/servicesSlice";
import generalConfigReducer from "./slices/generalConfigSlice/index";
import { useDispatch } from "react-redux";
export const store = configureStore({
  reducer: {
    flights: flightsReducer,
    services: servicesReducer,
    general: generalConfigReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
