import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme as NavigationDarkTHeme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import { Provider } from "react-redux";
import merge from "deepmerge";
import { useColorScheme } from "@/components/useColorScheme";
import { store } from "@/redux/store";
import { Text } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

import { enGB, registerTranslation } from "react-native-paper-dates";
registerTranslation("en-GB", enGB);

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTHeme,
  reactNavigationLight: NavigationDefaultTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, {
  ...LightTheme,
  // colors: {
  //   ...LightTheme.colors,
  //   text: "#000",
  //   background: "#fff",
  //   tint: tintColorLight,
  //   tabIconDefault: "#ccc",
  //   tabIconSelected: tintColorLight,
  //   container: "#D8D8D8",
  // },
});
const CombinedDarkTheme = merge(MD3DarkTheme, {
  ...DarkTheme,
  // colors: {
  //   ...DarkTheme.colors,
  //   text: "#fff",
  //   background: "#000",
  //   tint: tintColorDark,
  //   tabIconDefault: "#ccc",
  //   tabIconSelected: tintColorDark,
  //   container: "#494949",
  // },
});

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(drawer)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const themeBase =
    colorScheme === "light" ? CombinedDefaultTheme : CombinedDarkTheme;

  return (
    <Provider store={store}>
      <PaperProvider theme={themeBase}>
        <ThemeProvider value={themeBase}>
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(createFlight)/arrival"
              options={{
                headerShown: true,
                title: "Stage 1 of 2 (Arrival)",
              }}
            />
            <Stack.Screen
              name="(createFlight)/departure"
              options={{
                headerShown: true,
                title: "Stage 2 of 2 (Departure)",
              }}
            />
          </Stack>
        </ThemeProvider>
      </PaperProvider>
    </Provider>
  );
}
