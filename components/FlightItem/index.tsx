import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  InteractionManager,
} from "react-native";
import { ReactNode, useState } from "react";
import { useTheme, Text, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFlight,
  setCurrentFlightById,
  updateFlight,
} from "@/redux/slices/flightsSlice";
import dayjs from "dayjs";
import { RootState } from "@/redux/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useRealm } from "@realm/react";
import { GeneralConfigState } from "@/models/Config";
import { IFlight } from "@/models/Flight";
import { realmWithoutSync } from "@/realm";
import { Animated } from "react-native";

type Field = [
  label: ReactNode,
  value: ReactNode,
  displayField?: boolean | undefined | null
];
const FlightItem = ({ flight }: { flight: IFlight }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const realm = useRealm();
  const [realmCurrentFlight] = useQuery<IFlight>(
    "Flight",
    (collection) => collection.filtered("flightId == $0", flight.flightId),
    [flight.flightId]
  );
  const [configs] = useQuery<GeneralConfigState>("General");
  const baseAirport = configs.defaultAirport;
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
  const parseRouteString = () => {
    if (flight?.handlingType === "FULL")
      return `${flight?.arrival?.from}-${baseAirport}-${flight?.departure?.to}`;

    if (flight?.handlingType === "Arrival") {
      return `${flight?.arrival?.from} - ${baseAirport}`;
    }

    if (flight?.handlingType === "Departure") {
      return ` ${baseAirport} - ${flight?.departure?.to}`;
    }
  };

  const fieldsArray: Array<Field> = [
    ["ROUTE:", <>{parseRouteString() || "N/A"}</>],
    ["FLIGHT NUMBER:", <>{flight?.flightNumber}</>],
    ["OPERATOR:", <>{flight?.operatorName}</>],
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
      flight.handlingType !== "Arrival",
    ],
    ["STATUS:", flight.status || "Uncompleted"],
    ["HANDLING TYPE:", flight?.handlingType || "N/A"],
  ];

  const [opacity, setOpacity] = useState(new Animated.Value(Number(1)));
  const [isVisible, setIsVisible] = useState(true);

  return (
    isVisible && (
      <Animated.View key={flight?.flightId} style={{ opacity }}>
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
                InteractionManager.setDeadline(100);
                InteractionManager.runAfterInteractions(() => {
                  if (flight?.status !== "Completed") {
                    dispatch(setCurrentFlightById(flight?.flightId as string));
                    router.navigate("/(createFlight)/general");
                  }
                });
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
                {fieldsArray
                  ?.filter(([label, value, display]) => display !== false)
                  .map(([label, value], i) => {
                    return (
                      <Text
                        key={i}
                        variant="bodySmall"
                        style={{
                          color: theme.colors.onSurfaceVariant,
                        }}
                      >
                        <Text style={{ fontWeight: "900" }}>{label}</Text>{" "}
                        {value}
                      </Text>
                    );
                  })}
              </View>
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => {
              Alert.alert(
                "Remove flight?",
                `Are you sure you want to remove flight ${flight?.flightNumber}?`,
                [
                  {
                    text: "Confirm",
                    onPress: () =>
                      Animated.timing(opacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true, // Add this line
                      }).start(() => {
                        // setOpacity(new Animated.Value(1));
                        setIsVisible(false);
                        try {
                          realm.write(() => realm.delete(realmCurrentFlight));
                        } catch (e) {
                          Alert.alert(
                            "Error removing flight",
                            JSON.stringify(e, null, 5)
                          );
                        }
                      }),
                    style: "destructive",
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                ],
                {
                  cancelable: true,
                }
              );
            }}
            leadingIcon={() => (
              <MaterialCommunityIcons
                name="trash-can"
                color={theme?.colors?.error}
                size={18}
              />
            )}
            titleStyle={{
              color: theme.colors.error,
              columnGap: 3,
            }}
            title={"Remove flight"}
          />
          {(flight.handlingType === "Arrival" ||
            flight.handlingType === "FULL") &&
            flight?.arrival &&
            flight?.status !== "Completed" && (
              <Menu.Item
                onPress={() => {
                  dispatch(setCurrentFlightById(flight?.flightId as string));

                  // dispatch(removeFlight(flight?.flightId as string));   dispatch(setCurrentFlightById(flight?.flightId as string));
                  router.navigate("/(createFlight)/arrival");
                  closeMenu();
                }}
                leadingIcon={() => (
                  <MaterialCommunityIcons
                    name="airplane-landing"
                    color={theme?.colors?.primary}
                    size={18}
                  />
                )}
                title="Go to Arrival"
              />
            )}
          {(flight.handlingType === "Departure" ||
            flight.handlingType === "FULL") &&
            flight?.departure &&
            flight?.status !== "Completed" && (
              <Menu.Item
                onPress={() => {
                  // dispatch(removeFlight(flight?.flightId as string));
                  dispatch(setCurrentFlightById(flight?.flightId as string));
                  router.navigate("/(createFlight)/departure");
                  closeMenu();
                }}
                leadingIcon={() => (
                  <MaterialCommunityIcons
                    name="airplane-takeoff"
                    color={theme?.colors?.primary}
                    size={18}
                  />
                )}
                title="Go to Departure"
              />
            )}
          {flight.providedServices && (
            <>
              {flight?.status !== "Completed" && (
                <Menu.Item
                  onPress={() => {
                    dispatch(setCurrentFlightById(flight?.flightId as string));

                    // dispatch(removeFlight(flight?.flightId as string));   dispatch(setCurrentFlightById(flight?.flightId as string));
                    router.navigate("/(createFlight)/providedServices");
                    closeMenu();
                  }}
                  leadingIcon={() => (
                    <MaterialCommunityIcons
                      name="clipboard-list-outline"
                      color={theme?.colors?.primary}
                      size={18}
                    />
                  )}
                  title="Go to Provided Services"
                />
              )}
              {flight?.crew && flight?.ramp && (
                <>
                  <Menu.Item
                    onPress={() => {
                      dispatch(
                        setCurrentFlightById(flight?.flightId as string)
                      );

                      // dispatch(removeFlight(flight?.flightId as string));   dispatch(setCurrentFlightById(flight?.flightId as string));
                      router.navigate("/(createFlight)/(tabs)/chargeNote");
                      closeMenu();
                    }}
                    leadingIcon={() => (
                      <MaterialCommunityIcons
                        name="cloud-print-outline"
                        color={theme?.colors?.primary}
                        size={18}
                      />
                    )}
                    title="Go to PDF files generation"
                  />
                  {flight?.status !== "Completed" && (
                    <Menu.Item
                      onPress={() => {
                        try {
                          realm.write(() => {
                            realmCurrentFlight.status = "Completed";
                          });
                        } catch (e) {
                          Alert.alert(
                            "Error changing flight status",
                            JSON.stringify(e, null, 5)
                          );
                        }
                      }}
                      leadingIcon={() => (
                        <MaterialCommunityIcons
                          name="tooltip-check-outline"
                          color={theme?.colors?.primary}
                          size={18}
                        />
                      )}
                      title="Mark flight as completed"
                    />
                  )}
                </>
              )}
            </>
          )}
        </Menu>
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 15,
    borderRadius: 20,
  },
  removeButton: {
    color: "red",
  },
});

export default FlightItem;
