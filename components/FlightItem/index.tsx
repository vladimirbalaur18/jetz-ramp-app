import {
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  useColorScheme,
} from "react-native";
import { useState } from "react";
import { Icon, useTheme, Text, Menu } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { Flight } from "@/redux/types";
import { useDispatch } from "react-redux";
import {
  removeFlight,
  setCurrentFlightById,
} from "@/redux/slices/flightsSlice";
import dayjs from "dayjs";
const FlightItem = ({ flight }: { flight: Flight }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();

  //
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const fieldsArray = [
    ["DESTINATION:", <>{flight?.departure?.to || "N/A"}</>],
    ["FLIGHT NUMBER:", <>{flight?.flightNumber}</>],
    [
      "ETA:",
      <>
        {dayjs(flight?.arrival?.arrivalDate).format("DD/MM/YYYY" || "N/A")}{" "}
        {flight?.arrival?.arrivalTime
          ? `${flight?.arrival?.arrivalTime?.hours}${flight?.arrival?.arrivalTime?.minutes}Z`
          : "N/A"}
      </>,
    ],
    [
      "ETD:",
      <>
        {dayjs(flight?.departure?.departureDate).format("DD/MM/YYYY")}{" "}
        {flight?.departure?.departureTime
          ? `${flight?.departure?.departureTime?.hours}${flight?.departure?.departureTime?.minutes}Z`
          : "N/A"}
      </>,
    ],
    ["STATUS:", "TBD"],
  ];
  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchorPosition="bottom"
      anchor={
        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            borderRadius: 25,
          }}
          onPress={() => {
            dispatch(setCurrentFlightById(flight?.flightId as string));
            router.navigate("/(createFlight)/arrival");
          }}
          onLongPress={() => openMenu()}
        >
          <View
            style={{
              ...styles.container,
              backgroundColor: theme.colors.surfaceVariant,
              elevation: 5,
            }}
          >
            {fieldsArray?.map(([label, value]) => {
              return (
                <Text
                  variant="bodySmall"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                  }}
                >
                  <Text style={{ fontWeight: "900" }}>{label}</Text> {value}
                </Text>
              );
            })}
          </View>
        </TouchableOpacity>
      }
    >
      <Menu.Item
        onPress={() => {
          dispatch(removeFlight(flight?.flightId as string));
        }}
        title="Remove flight"
      />
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 15,
    borderRadius: 20,
  },
});

export default FlightItem;
