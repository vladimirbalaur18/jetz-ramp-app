import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme as NavigationDarkTHeme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
  Button,
  IconButton,
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
import { SnackbarProvider } from "@/context/snackbarContext";
import uuid from "react-uuid";
import { IServiceCategory } from "@/models/ServiceCategory";
import { ObjectId } from "bson";
import { IService, Service } from "@/models/Services";
import { IAppData } from "@/models/AppData";
import { AirportFees, IAirportFees } from "@/models/AirportFees";
import { AirportFeeDefinition } from "@/models/AirportFeeDefinition";
import { FeeQuota } from "@/models/FeeQuota";
import DefaultAirportFees from "@/configs/airportFees.json";
import { AuthProvider } from "@/context/authContext";
import { MaterialIcons } from "@expo/vector-icons";
import _selectCurrentFlight from "@/utils/selectCurrentFlight";

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
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </Provider>
    </RealmProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const realm = useRealm();
  const router = useRouter();

  const themeBase =
    colorScheme === "light" ? CombinedDefaultTheme : CombinedDarkTheme;
  const dispatch = useDispatch<AppDispatch>();
  const currentFlightId = useSelector(
    (state: RootState) => state.flights.currentFlightId
  );
  const currentFlightNumber = _selectCurrentFlight(
    currentFlightId || ""
  )?.toJSON()?.flightNumber;
  const [configs] = realmWithoutSync.objects("General");
  const [AppData] = realmWithoutSync.objects("AppData").toJSON() as IAppData[];
  const [AirportFees] = realmWithoutSync.objects<IAirportFees>("AirportFees");
  const basicHandlingFees = realmWithoutSync.objects("BasicHandlingRule");
  const serviceCategories =
    realmWithoutSync.objects<IServiceCategory>("ServiceCategory");

  const FlightNumberIndicator = currentFlightNumber
    ? `(${currentFlightNumber})`
    : "";

  useEffect(() => {
    if (!AppData || !AppData.masterPassword) {
      //initialize basic handling rules if none exists
      if (!basicHandlingFees?.length) {
        realmWithoutSync.write(() => {
          DefaultBasicHandlingFees.forEach((fee) => {
            realmWithoutSync.create("BasicHandlingRule", { ...fee, notes: "" });
          });
        });
      }

      //initialize service and categories if none exist
      if (!serviceCategories?.length) {
        DefaultServices.forEach(({ serviceCategoryName, services }) => {
          const category = realmWithoutSync.write(() => {
            const _cat = realmWithoutSync.create<IServiceCategory>(
              "ServiceCategory",
              {
                _id: new ObjectId(),
                categoryName: serviceCategoryName,
              }
            );

            return _cat;
          });

          realmWithoutSync.write(() =>
            services.map((s) =>
              category.services.push(
                new Service(realm, {
                  _id: new ObjectId(),
                  categoryName: serviceCategoryName,
                  ...s,
                })
              )
            )
          );
        });
      }

      if (!AirportFees) {
        realmWithoutSync.write(() => {
          realmWithoutSync.create<IAirportFees>("AirportFees", {
            commercial: new AirportFeeDefinition(realmWithoutSync, {
              landingFee: new FeeQuota(realmWithoutSync, {
                ...DefaultAirportFees.commercial.landingFee,
              }),
              takeoffFee: new FeeQuota(realmWithoutSync, {
                ...DefaultAirportFees.commercial.takeoffFee,
              }),
              passengerFee: new FeeQuota(realmWithoutSync, {
                ...DefaultAirportFees.commercial.passengerFee,
              }),
              securityFee: new FeeQuota(realmWithoutSync, {
                ...DefaultAirportFees.commercial.securityFee,
              }),
              parkingDay: new FeeQuota(realmWithoutSync, {
                ...DefaultAirportFees.commercial.parkingDay,
              }),
            }),
            nonCommercial: new AirportFeeDefinition(realmWithoutSync, {
              landingFee: new FeeQuota(realmWithoutSync, {
                ...DefaultAirportFees.nonCommercial.landingFee,
              }),
              takeoffFee: new FeeQuota(realmWithoutSync, {
                ...DefaultAirportFees.nonCommercial.takeoffFee,
              }),
              passengerFee: new FeeQuota(realmWithoutSync, {
                ...DefaultAirportFees.nonCommercial.passengerFee,
              }),
              securityFee: new FeeQuota(realmWithoutSync, {
                ...DefaultAirportFees.nonCommercial.securityFee,
              }),
              parkingDay: new FeeQuota(realmWithoutSync, {
                ...DefaultAirportFees.nonCommercial.parkingDay,
              }),
            }),
          });
        });
      }

      return router.navigate("/initial");
    }

    if (!configs) {
      router.navigate("(drawer)/(confTabs)/config");
    }
  }, []);

  return (
    <PaperProvider theme={themeBase}>
      <ThemeProvider value={themeBase}>
        <SnackbarProvider>
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
                headerLeft: () => (
                  <IconButton
                    onLongPress={() => {
                      router.navigate("/");
                    }}
                    onPress={() => router.back()}
                    icon={"arrow-left"}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="(createFlight)/departure"
              options={{
                headerShown: true,
                title: `Departure information ${FlightNumberIndicator}`,
                headerLeft: () => (
                  <IconButton
                    onLongPress={() => {
                      router.navigate("/");
                    }}
                    onPress={() => router.back()}
                    icon={"arrow-left"}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="(createFlight)/providedServices"
              options={{
                headerShown: true,
                title: `Provided services ${FlightNumberIndicator}`,
                headerLeft: () => (
                  <IconButton
                    onLongPress={() => {
                      router.navigate("/");
                    }}
                    onPress={() => router.back()}
                    icon={"arrow-left"}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="(createFlight)/signature"
              options={{
                headerShown: true,
                title: `Signature ${FlightNumberIndicator}`,
                headerLeft: () => (
                  <IconButton
                    onLongPress={() => {
                      router.navigate("/");
                    }}
                    onPress={() => router.back()}
                    icon={"arrow-left"}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="(createFlight)/(tabs)"
              options={{
                headerShown: true,
                title: `Generate PDF files ${FlightNumberIndicator}`,
                headerLeft: () => (
                  <IconButton
                    onLongPress={() => {
                      router.navigate("/");
                    }}
                    onPress={() => router.back()}
                    icon={"arrow-left"}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="initial"
              options={{
                headerShown: false,
                title: `Generate PDF files ${FlightNumberIndicator}`,
              }}
            />
            <Stack.Screen
              name="autorize"
              options={{
                headerShown: true,
                title: ``,
                headerLeft: () =>
                  configs ? (
                    <Button
                      icon="arrow-left"
                      onPress={() => {
                        router.navigate("/");
                      }}
                    >
                      Home
                    </Button>
                  ) : null,
              }}
            />
          </Stack>
        </SnackbarProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
