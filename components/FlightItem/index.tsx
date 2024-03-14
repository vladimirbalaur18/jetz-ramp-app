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
const FlightItem = ({ flight }: { flight: Flight }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();

  //
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

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
            router.navigate("/(createFlight)/arrival");
            dispatch(setCurrentFlightById(flight?.flightId as string));
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
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurfaceVariant,
              }}
            >
              {flight?.arrival?.from || "N/A"}{" "}
              <MaterialCommunityIcons name="arrow-right-thick" size={16} />{" "}
              {flight?.departure?.to || "N/A"}
            </Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              {flight?.flightNumber}
            </Text>
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
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
  },
});

export default FlightItem;
