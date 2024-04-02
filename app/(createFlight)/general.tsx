import React, { useLayoutEffect, useState } from "react";
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
import { Flight, ProvidedServices } from "@/redux/types";
import {
  useForm,
  Controller,
  useFieldArray,
  UseFieldArrayRemove,
  Control,
  FieldErrors,
} from "react-hook-form";
import { FlightSchedule } from "@/redux/types";
import {
  DatePickerInput,
  DatePickerModal,
  TimePicker,
  TimePickerModal,
} from "react-native-paper-dates";
import dayjs, { Dayjs } from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
type FormData = Flight;
import REGEX from "@/utils/regexp";
const ERROR_MESSAGES = {
  REQUIRED: "This Field Is Required",
  NAME_INVALID: "Not a Valid Name",
  TERMS: "Terms Must Be Accepted To Continue",
  EMAIL_INVALID: "Not a Valid Email",
};
import { useDispatch, useSelector } from "react-redux";
import { createFlight, updateFlight } from "@/redux/slices/flightsSlice";
import { RootState } from "@/redux/store";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import CrewMemberInputFields from "@/components/FormUtils/CrewMemberInputFields";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import DropDown from "react-native-paper-dropdown";
import _ from "lodash";

const Form: React.FC = () => {
  const router = useRouter();
  const state = useSelector((state: RootState) => state);
  const existingFlight = selectCurrentFlight(state);

  const [handleTypeDropdownVisible, setHandleTypeDropdownVisible] =
    useState(false);
  const dispatch = useDispatch();

  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: (existingFlight as unknown as Flight) || {
      aircraftRegistration: "LY-TBA",
      aircraftType: "SFR22",
      isCommercialFlight: true,
      parkingPosition: 22,
      flightNumber: "TY123",
      operatorName: "OperatorName",
      orderingCompanyName: "OrderingOperator",
      scheduleType: FlightSchedule.NonScheduled,
      mtow: 2417,
    },
  });
  const { errors } = formState;
  const submit = (data: Flight) => {
    //nullyfy services if we update new data

    if (existingFlight) {
      if (!_.isEqual(existingFlight, data)) {
        dispatch(
          updateFlight({
            ...data,
            providedServices: null as unknown as ProvidedServices,
          })
        );
      }
    } else {
      alert("creating a flight");
      dispatch(createFlight(data));
    }

    alert(JSON.stringify(data));
    //need to see based on flight plan type
    router.navigate(
      data?.handlingType === "Departure"
        ? "/(createFlight)/departure"
        : "/(createFlight)/arrival"
    );
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
        alwaysBounceVertical={false}
      >
        <SectionTitle>General</SectionTitle>
        <Controller
          control={control}
          defaultValue={"FULL"}
          name="handlingType"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <DropDown
                label={"Handling type"}
                mode={"outlined"}
                visible={handleTypeDropdownVisible}
                showDropDown={() =>
                  !existingFlight?.handlingType &&
                  setHandleTypeDropdownVisible(true)
                }
                onDismiss={() => setHandleTypeDropdownVisible(false)}
                value={value}
                setValue={(value) => {
                  onChange(value);
                }}
                list={[
                  { label: "Departure", value: "Departure" },
                  { label: "Full", value: "FULL" },
                  { label: "Arrival", value: "Arrival" },
                ]}
              />
              <HelperText type="error">
                {errors?.handlingType?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="operatorName"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Not a valid operator Name",
              value: REGEX.operatorName,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Operator Name"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.operatorName && true}
              />
              <HelperText type="error">
                {errors.operatorName?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="flightNumber"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Not a Valid Flight number",
              value: REGEX.flightNumber,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Flight number"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.flightNumber && true}
              />
              <HelperText type="error">
                {errors.flightNumber?.message}
              </HelperText>
            </>
          )}
        />

        <Controller
          control={control}
          name="scheduleType"
          defaultValue={FlightSchedule.Other}
          rules={{
            required: { message: ERROR_MESSAGES.REQUIRED, value: true },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <List.Section title="Schedule type">
                <RadioButton.Group
                  value={value as string}
                  onValueChange={(value: string) => {
                    onChange(value);
                  }}
                >
                  {Object.entries(FlightSchedule).map(([key, value]) => {
                    return <RadioButton.Item label={key} value={key} />;
                  })}
                </RadioButton.Group>
              </List.Section>
              <HelperText type="error">
                {errors.scheduleType?.message}
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyLarge">Is local (MD only) flight</Text>
          <Controller
            control={control}
            defaultValue={false}
            name="isLocalFlight"
            render={({ field: { value, onChange } }) => (
              <>
                <Switch
                  value={value}
                  onValueChange={(value) => onChange(value)}
                />
              </>
            )}
          />
        </View>
        <View style={styles.row}>
          <Text variant="bodyLarge">Is Commercial flight</Text>
          <Controller
            control={control}
            defaultValue={false}
            name="isCommercialFlight"
            render={({ field: { value, onChange } }) => (
              <>
                <Switch
                  value={value}
                  onValueChange={(value) => onChange(value)}
                />
              </>
            )}
          />
        </View>
        {/*  */}
        <Controller
          control={control}
          defaultValue=""
          name="orderingCompanyName"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Not a valid company Name",
              value: REGEX.operatorName,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Ordering company name"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.orderingCompanyName && true}
              />
              <HelperText type="error">
                {errors.orderingCompanyName?.message}
              </HelperText>
            </>
          )}
        />
        {/*  */}
        <Controller
          control={control}
          defaultValue=""
          name="aircraftType"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Aircraft type"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.aircraftType && true}
              />
              <HelperText type="error">
                {errors.aircraftType?.message}
              </HelperText>
            </>
          )}
        />
        {/*  */}
        <Controller
          control={control}
          defaultValue=""
          name="aircraftRegistration"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Aircraft registration format is not valid",
              value: REGEX.aircraftRegistration,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Aircraft registration"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.aircraftRegistration && true}
              />
              <HelperText type="error">
                {errors.aircraftRegistration?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="parkingPosition"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            // pattern: {
            //   message: "Not a valid operator Name",
            // },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Parking position"
                style={styles.input}
                value={String(value)}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.parkingPosition && true}
              />
              <HelperText type="error">
                {errors.parkingPosition?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="mtow"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Must be a valid number",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="MTOW (kg)"
                style={styles.input}
                value={String(value)}
                keyboardType="number-pad"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.mtow && true}
              />
              <HelperText type="error">{errors.mtow?.message}</HelperText>
            </>
          )}
        />
        <Button
          mode="contained"
          onPress={handleSubmit(submit)}
          disabled={!formState.isValid}
        >
          {existingFlight ? "Save information" : "Create new flight"}
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
