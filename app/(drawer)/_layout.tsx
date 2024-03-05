import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Home",
            title: "Main page",
            drawerIcon: () => (
              <MaterialCommunityIcons name="airport" size={24} color="black" />
            ),
          }}
        />
        <Drawer.Screen
          name="config" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Configuration",
            title: "Configurations",
            drawerIcon: () => (
              <FontAwesome6 name="user-gear" size={24} color="black" />
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
