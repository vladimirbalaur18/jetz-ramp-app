import {
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  useColorScheme,
} from "react-native";
import { useState } from "react";
import { Icon, useTheme, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const FlightItem = ({ callsign = "", departure = "", arrival = "" }) => {
  const [pressed, setPressed] = useState(false);
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "transparent",
        borderRadius: 25,
      }}
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
          {departure || "N/A"}{" "}
          <MaterialCommunityIcons name="arrow-right-thick" size={16} />{" "}
          {arrival || "N/A"}
        </Text>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>{callsign}</Text>
      </View>
    </TouchableOpacity>
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
