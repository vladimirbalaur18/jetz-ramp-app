import React, { useState } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import {
  TextInput,
  Button,
  Switch,
  HelperText,
  List,
  Text,
  RadioButton,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import REGEX from "@/utils/regexp";
import { useDispatch, useSelector } from "react-redux";
import {
  createFlight,
  setCurrentFlightById,
  updateFlight,
} from "@/redux/slices/flightsSlice";
import { RootState } from "@/redux/store";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import DropDown from "react-native-paper-dropdown";
import _ from "lodash";
import formStyles from "@/styles/formStyles";
import { IProvidedServices } from "@/models/ProvidedServices";
import { FlightSchedule, IFlight } from "@/models/Flight";
import _selectCurrentFlight from "@/utils/selectCurrentFlight";
import { useQuery, useRealm } from "@realm/react";
import uuid from "react-uuid";
import { IChargeNoteDetails } from "@/models/ChargeNoteDetails";
import { ICurrencyRates } from "@/models/CurrencyRates";
type FormData = IFlight;
const ERROR_MESSAGES = {
  REQUIRED: "This Field Is Required",
  NAME_INVALID: "Not a Valid Name",
  TERMS: "Terms Must Be Accepted To Continue",
  EMAIL_INVALID: "Not a Valid Email",
};

const Form: React.FC = () => {
  const router = useRouter();
  const state = useSelector((state: RootState) => state);
  const realmExistingFlight = _selectCurrentFlight(
    state.flights.currentFlightId || ""
  );
  const existingFlightJSON = realmExistingFlight?.toJSON() as IFlight;
  console.log("existingFlightJSON", existingFlightJSON);
  const [handleTypeDropdownVisible, setHandleTypeDropdownVisible] =
    useState(false);
  const dispatch = useDispatch();

  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: existingFlightJSON || {
      aircraftRegistration: "LY-TBA",
      aircraftType: "SFR22",
      isCommercialFlight: true,
      parkingPosition: "22",
      flightNumber: "TY123",
      operatorName: "OperatorName",
      orderingCompanyName: "OrderingOperator",
      scheduleType: FlightSchedule.NonScheduled,
      mtow: 2417,
      chargeNote: {
        currency: {
          date: new Date(),
        },
      },
    },
  });
  const { errors } = formState;
  const realm = useRealm();
  const allFlight = useQuery<IFlight>("Flight");
  console.log("allFlight", allFlight);
  const submit = (data: IFlight) => {
    //nullyfy services if we update new data

    //OLD REDUX LOGIC
    // if (existingFlight) {
    //   if (!_.isEqual(existingFlight, data)) {
    //     dispatch(
    //       updateFlight({
    //         ...data,
    //         providedServices: null as unknown as IProvidedServices,
    //       })
    //     );
    //   }
    // } else {
    //   alert("creating a flight");
    //   dispatch(createFlight(data));
    // }

    if (!realmExistingFlight) {
      realm.write(() => {
        const newFlightId = uuid();
        realm.create<IFlight>("Flight", {
          ...data,
          chargeNote: realm.create<IChargeNoteDetails>("ChargeNoteDetails", {
            currency: realm.create<ICurrencyRates>("CurrencyRates", {
              date: data.chargeNote.currency.date,
              usdToMDL: data.chargeNote.currency.usdToMDL,
              euroToMDL: data.chargeNote.currency.euroToMDL,
            }),
          }),
          flightId: newFlightId,
        });
        dispatch(setCurrentFlightById(newFlightId));
      });
    } else {
      console.log("from db, existing flight");
      if (!_.isEqual(realmExistingFlight.toJSON(), data)) {
        alert("updaging");
        dispatch(setCurrentFlightById(data.flightId as any));

        realm.write(() => {
          realmExistingFlight.aircraftRegistration = data.aircraftRegistration;
          realmExistingFlight.aircraftType = data.aircraftType;
          realmExistingFlight.chargeNote.date = data.chargeNote.date;
          realmExistingFlight.chargeNote.currency.euroToMDL =
            data.chargeNote.currency.euroToMDL;
          realmExistingFlight.chargeNote.currency.usdToMDL =
            data.chargeNote.currency.usdToMDL;
          realmExistingFlight.crew = data?.crew;
          realmExistingFlight.departure = data?.departure;
          realmExistingFlight.flightNumber = data?.flightNumber;
          realmExistingFlight.handlingType = data?.handlingType;
          realmExistingFlight.isCommercialFlight = data?.isCommercialFlight;
          realmExistingFlight.mtow = Number(data?.mtow);
          realmExistingFlight.operatorName = data?.operatorName;
          realmExistingFlight.orderingCompanyName = data?.orderingCompanyName;
          realmExistingFlight.parkingPosition = data?.parkingPosition;
          realmExistingFlight.providedServices = undefined;
          realmExistingFlight.ramp = undefined;
          realmExistingFlight.scheduleType = data?.scheduleType;
          realmExistingFlight.status = data?.status;
        });
      }
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
                  !realmExistingFlight?.toJSON()?.handlingType &&
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
                onChangeText={(value) => onChange(String(value))}
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
                onChangeText={(value) => onChange(Number(value))}
                error={errors.mtow && true}
              />
              <HelperText type="error">{errors.mtow?.message}</HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="chargeNote.currency.euroToMDL"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="EURO to MDL rate"
                style={formStyles.input}
                value={value}
                onBlur={onBlur}
                keyboardType="numeric"
                onChangeText={(value) => onChange(value)}
                error={errors?.chargeNote?.currency?.euroToMDL && true}
              />
              <HelperText type="error">
                {errors.chargeNote?.currency?.euroToMDL?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="chargeNote.currency.usdToMDL"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="USD to MDL rate"
                style={formStyles.input}
                value={value}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.chargeNote?.currency?.usdToMDL && true}
              />
              <HelperText type="error">
                {errors.chargeNote?.currency?.usdToMDL?.message}
              </HelperText>
            </>
          )}
        />
        <Button
          mode="contained"
          onPress={handleSubmit(submit)}
          disabled={!formState.isValid}
        >
          {realmExistingFlight?.toJSON()
            ? "Save information"
            : "Create new flight"}
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
