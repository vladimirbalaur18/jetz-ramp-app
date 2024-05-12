import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { AppDispatch, RootState } from "@/redux/store";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { useAuthContext } from "@/context/authContext";

export default function TabLayout() {
  const iconColor = useTheme();
  const { logout, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    return () => {
      logout();
    };
  }, []);
  return isAuthenticated ? (
    <Tabs>
      <Tabs.Screen
        name="config"
        options={{
          title: "General settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="user-gear"
              size={24}
              color={
                focused ? iconColor.colors.primary : iconColor.colors.secondary
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="airportFees"
        options={{
          title: "Airport fees",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="plane"
              size={24}
              color={
                focused ? iconColor.colors.primary : iconColor.colors.secondary
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="basicHandlingSettings"
        options={{
          title: "Basic handling settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="cart-flatbed-suitcase"
              size={24}
              color={
                focused ? iconColor.colors.primary : iconColor.colors.secondary
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(services)"
        options={{
          title: "Services settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="list"
              size={24}
              color={
                focused ? iconColor.colors.primary : iconColor.colors.secondary
              }
            />
          ),
        }}
      />
    </Tabs>
  ) : (
    <Redirect href={"/autorize"} />
  );
}
