import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme as NavigationDarkTHeme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import { Provider, useDispatch, useSelector } from "react-redux";
import merge from "deepmerge";
import { useColorScheme } from "@/components/useColorScheme";
import { AppDispatch, RootState, store } from "@/redux/store";
import { RealmProvider, useQuery, useRealm } from "@realm/react";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

import { enGB, registerTranslation } from "react-native-paper-dates";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { realmConfig, realmWithoutSync } from "@/realm";
import DefaultBasicHandlingFees from "@/configs/basicHandlingFees.json";
import DefaultServices from "@/configs/serviceDefinitions.json";
import { ServicesSchema } from "@/models/Services";
registerTranslation("en-GB", enGB);

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTHeme,
  reactNavigationLight: NavigationDefaultTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, {
  ...LightTheme,
});
const CombinedDarkTheme = merge(MD3DarkTheme, {
  ...DarkTheme,
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

  return (
    <RealmProvider schema={realmConfig.schema}>
      <Provider store={store}>
        <RootLayoutNav />
      </Provider>
    </RealmProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const realm = useRealm();
  const themeBase =
    colorScheme === "light" ? CombinedDefaultTheme : CombinedDarkTheme;
  const dispatch = useDispatch<AppDispatch>();
  const currentFlightNumber = selectCurrentFlight(
    useSelector((state: RootState) => state)
  )?.flightNumber;
  const [configs] = realmWithoutSync.objects("General");
  const basicHandlingFees = realmWithoutSync.objects("BasicHandling");
  const services = realmWithoutSync.objects<ServicesSchema>("Services");

  const FlightNumberIndicator = currentFlightNumber
    ? `(${currentFlightNumber})`
    : "";

  useEffect(() => {
    if (!configs) {
      router.navigate("/(drawer)/config");
    }

    if (!basicHandlingFees?.length) {
      realmWithoutSync.write(() => {
        DefaultBasicHandlingFees.forEach((fee) => {
          realmWithoutSync.create("BasicHandling", { ...fee });
        });
      });
    }

    if (!services?.length) {
      DefaultServices.forEach((serviceCategory) => {
        realmWithoutSync.write(() => {
          const servicesArray = serviceCategory.services.map((service) => {
            return realmWithoutSync.create("Service", { ...service });
          });

          realmWithoutSync.create("Services", {
            serviceCategoryName: serviceCategory.serviceCategoryName,
            services: servicesArray,
          });
        });
      });
    }
  }, []);

  return (
    <PaperProvider theme={themeBase}>
      <ThemeProvider value={themeBase}>
        <Stack>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />

          <Stack.Screen
            name="(createFlight)/general"
            options={{
              headerShown: true,
              title: "General flight information",
            }}
          />
          <Stack.Screen
            name="(createFlight)/arrival"
            options={{
              headerShown: true,
              title: `Arrival information ${FlightNumberIndicator}`,
            }}
          />
          <Stack.Screen
            name="(createFlight)/departure"
            options={{
              headerShown: true,
              title: `Departure information ${FlightNumberIndicator}`,
            }}
          />
          <Stack.Screen
            name="(createFlight)/providedServices"
            options={{
              headerShown: true,
              title: `Provided services ${FlightNumberIndicator}`,
            }}
          />
          <Stack.Screen
            name="(createFlight)/signature"
            options={{
              headerShown: true,
              title: `Signature ${FlightNumberIndicator}`,
            }}
          />
          <Stack.Screen
            name="(createFlight)/(tabs)"
            options={{
              headerShown: true,
              title: `Generate PDF files ${FlightNumberIndicator}`,
            }}
          />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
