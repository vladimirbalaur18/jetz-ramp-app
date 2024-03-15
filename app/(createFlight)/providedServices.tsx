import React, { ReactNode } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextComponent,
  SafeAreaView,
} from "react-native";
import {
  TextInput,
  Button,
  Switch,
  HelperText,
  List,
  Text,
  RadioButton,
} from "react-native-paper";
import { Flight } from "@/redux/types";
import { useForm, Controller } from "react-hook-form";
import { FlightSchedule } from "@/redux/types";
import {
  DatePickerInput,
  DatePickerModal,
  TimePicker,
  TimePickerModal,
} from "react-native-paper-dates";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "expo-router";
import REGEX from "@/utils/regexp";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type FormData = Flight;

const ERROR_MESSAGES = {
  REQUIRED: "This Field Is Required",
  NAME_INVALID: "Not a Valid Name",
  TERMS: "Terms Must Be Accepted To Continue",
  EMAIL_INVALID: "Not a Valid Email",
};

const SectionTitle = ({ children }: { children: ReactNode }) => {
  return (
    <View style={styles.row}>
      <Text variant="headlineSmall">{children}</Text>
    </View>
  );
};

const Form: React.FC = () => {
  const router = useRouter();
  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      aircraftRegistration: "LY-TBA",
      aircraftType: "SR22",
      departure: {
        departureTime: { hours: 10, minutes: 12 },
        departureDate: new Date(),
        to: "LUKK",
        adultCount: 1,
        minorCount: 2,
        rampInspectionBeforeDeparture: {
          status: true,
          FOD: true,
          agent: {
            fullname: "Costea Andrei",
          },
        },
      },

      flightNumber: "TY123",
      operatorName: "Mama",
      orderingCompanyName: "Mama",
      scheduleType: FlightSchedule.NonScheduled,
    },
  });
  const { errors } = formState;

  const submit = (data: any) => {
    console.log(data);
    // router.navigate("/(createFlight)/providedServices");
  };
  const [visible, setVisible] = React.useState(false);

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
        alwaysBounceVertical={false}
      >
        <SectionTitle>Basic Handling</SectionTitle>

        <Button
          mode="contained"
          onPress={handleSubmit(submit)}
          disabled={!formState.isValid}
        >
          Submit services information
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginHorizontal: 30,
    paddingVertical: 30,
  },
  input: { marginVertical: 5 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
});
