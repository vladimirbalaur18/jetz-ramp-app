import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { AppDispatch, RootState } from "@/redux/store";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
  const iconColor = useTheme();

  return (
    <Tabs>
      <Tabs.Screen
        name="config"
        options={{
          title: "General settings",
          headerShown: false,
          tabBarIcon: () => (
            <FontAwesome6
              name="user-gear"
              size={24}
              color={iconColor.colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="basicHandlingSettings"
        options={{
          title: "Basic handling settings",
          headerShown: false,
          tabBarIcon: () => (
            <FontAwesome6
              name="cart-flatbed-suitcase"
              size={24}
              color={iconColor.colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="servicesSettings"
        options={{
          title: "Services settings",
          headerShown: false,
          tabBarIcon: () => (
            <FontAwesome6
              name="list"
              size={24}
              color={iconColor.colors.primary}
            />
          ),
        }}
      />
    </Tabs>
  );
}