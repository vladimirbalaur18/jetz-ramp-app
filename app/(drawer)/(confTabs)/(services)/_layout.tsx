import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="servicesSettings"
        options={{
          headerShown: true,
          title: "Services Settings:",
        }}
      />
      <Stack.Screen
        name="[serviceId]"
        initialParams={{ serviceId: null }}
        options={{
          headerShown: true,
          title: "Services Settings:",
        }}
      />
      <Stack.Screen
        name="newService"
        options={{
          headerShown: true,
          title: "Create service:",
        }}
      />
    </Stack>
  );
}
