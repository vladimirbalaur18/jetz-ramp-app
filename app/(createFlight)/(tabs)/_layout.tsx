import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { AppDispatch, RootState } from "@/redux/store";

export default function TabLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const currentFlightNumber = selectCurrentFlight(
    useSelector((state: RootState) => state)
  )?.flightNumber;
  const FlightNumberIndicator = currentFlightNumber
    ? `(${currentFlightNumber})`
    : "";

  return (
    <Tabs>
      <Tabs.Screen
        name="chargeNote"
        options={{
          title: `Charge Note ${FlightNumberIndicator}`,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="depArr"
        options={{
          title: "Dep & Arr",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
