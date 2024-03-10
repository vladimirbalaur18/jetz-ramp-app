import {
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  useColorScheme,
} from "react-native";
import { Text } from "../Themed";
import { useState } from "react";
import Colors from "@/constants/Colors";
import { Icon } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const FlightItem = ({ callsign = "", departure = "", arrival = "" }) => {
  const [pressed, setPressed] = useState(false);
  const themeStyle = useColorScheme();
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
          backgroundColor: Colors[themeStyle as "light" | "dark"].container,
          elevation: 5,
        }}
      >
        <Text>
          {departure || "N/A"}{" "}
          <MaterialCommunityIcons name="arrow-right-thick" size={16} />{" "}
          {arrival || "N/A"}
        </Text>
        <Text>{callsign}</Text>
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
