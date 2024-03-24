import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useTheme, Text, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
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

  const formatFlightTime = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) =>
    `${hours < 10 ? "0" + hours : hours}${
      minutes < 10 ? "0" + minutes : minutes
    }Z`;

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
          ? formatFlightTime(flight?.arrival?.arrivalTime)
          : "N/A"}
      </>,
    ],
    [
      "ETD:",
      <>
        {dayjs(flight?.departure?.departureDate).format("DD/MM/YYYY")}{" "}
        {flight?.departure?.departureTime
          ? formatFlightTime(flight?.departure?.departureTime)
          : "N/A"}
      </>,
    ],
    ["STATUS:", "TBD"],
    ["HANDLING TYPE:", flight?.handlingType || "N/A"],
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
            router.navigate("/(createFlight)/general");
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
