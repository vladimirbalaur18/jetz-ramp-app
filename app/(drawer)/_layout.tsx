import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MD3Colors } from "react-native-paper";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
export default function Layout() {
  const themeStyle = useColorScheme();
  const iconColor = Colors[themeStyle as "light" | "dark"].text;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Home",
            title: "Active flights",
            drawerIcon: () => (
              <MaterialCommunityIcons
                name="airport"
                size={24}
                color={iconColor}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="config" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Configuration",
            title: "Configurations",
            drawerIcon: () => (
              <FontAwesome6 name="user-gear" size={24} color={iconColor} />
            ),
          }}
        />
        {/* <Drawer.Screen
          name="user/[id]" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "User",
            title: "overview",
          }}
        /> */}
      </Drawer>
    </GestureHandlerRootView>
  );
}
