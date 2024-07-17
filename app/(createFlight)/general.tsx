import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
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
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import {
  Autocomplete,
  FlatDropdown,
  ModalDropdown,
} from "@/dependency/@telenko/react-native-paper-autocomplete";
import { useRouter } from "expo-router";
import REGEX from "@/utils/regexp";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentFlightById } from "@/redux/slices/flightsSlice";
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
import { IBillingOperator } from "@/models/billingOperators";
import {
  onlyIntNumber,
  replaceCommaWithDot,
} from "@/utils/numericInputFormatter";
import { useSnackbar } from "@/context/snackbarContext";
type FormData = IFlight;
const ERROR_MESSAGES = {
  REQUIRED: "This Field Is Required",
  NAME_INVALID: "Not a Valid Name",
  TERMS: "Terms Must Be Accepted To Continue",
  EMAIL_INVALID: "Not a Valid Email",
};

const Form: React.FC = () => {
  const router = useRouter();
  const currentFlightId = useSelector(
    (state: RootState) => state.flights.currentFlightId
  );
  const realmExistingFlight = _selectCurrentFlight(currentFlightId || "");
  const existingFlightJSON = realmExistingFlight?.toJSON() as IFlight;
  const [handleTypeDropdownVisible, setHandleTypeDropdownVisible] =
    useState(false);

  const { control, formState, handleSubmit, setValue } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: existingFlightJSON || {
      chargeNote: {
        currency: {
          date: new Date(),
        },
      },
    },
  });
  const dispatch = useDispatch();

  const operatorBillingInformations =
    useQuery<IBillingOperator>("BillingOperator");

  const handleOperatorNameOptionSelect = (v: string) => {
    for (let operatorBill of operatorBillingInformations.toJSON() as IBillingOperator[]) {
      if (v === operatorBill.operatorName) {
        setValue("chargeNote.billingTo", operatorBill.billingInfo);
      }
    }
  };

  const { errors } = formState;
  const snackbar = useSnackbar();
  const realm = useRealm();
  const allFlight = useQuery<IFlight>("Flight");
  const submit = (data: IFlight) => {
    try {
      if (!realmExistingFlight) {
        realm.write(() => {
          const newFlightId = uuid();
          realm.create<IFlight>("Flight", {
            ...data,
            chargeNote: realm.create<IChargeNoteDetails>("ChargeNoteDetails", {
              paymentType: data.chargeNote.paymentType,
              billingTo: data.chargeNote.billingTo,
              disbursementPercentage: Number(
                data.chargeNote.disbursementPercentage
              ),
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
        if (
          !_.isEqual(
            (realmExistingFlight.toJSON() as IFlight)?.mtow,
            data?.mtow
          ) &&
          realmExistingFlight.toJSON()?.providedServices
        ) {
          alert(
            "Disbursement fees, airport fees and basic handling will be reset due to MTOW change"
          );
          realm.write(() => {
            if (realmExistingFlight?.providedServices) {
              if (realmExistingFlight?.providedServices?.basicHandling)
                realmExistingFlight.providedServices.basicHandling = undefined;

              if (realmExistingFlight?.providedServices?.disbursementFees)
                realmExistingFlight.providedServices.disbursementFees =
                  undefined;

              if (
                realmExistingFlight?.providedServices?.supportServices
                  .airportFee
              )
                realmExistingFlight.providedServices.supportServices.airportFee =
                  undefined;
            }
          });
        }

        if (
          !_.isEqual(
            (realmExistingFlight.toJSON() as IFlight)?.chargeNote
              ?.disbursementPercentage,
            data?.chargeNote?.disbursementPercentage
          ) &&
          realmExistingFlight.toJSON()?.providedServices
        ) {
          console.warn(
            "Resetting disbursement fees due to change of percentage"
          );
          realm.write(
            () =>
              realmExistingFlight.providedServices &&
              realm.delete(
                realmExistingFlight.providedServices?.disbursementFees
              )
          );
        }
        realm.write(() => {
          realmExistingFlight.aircraftRegistration =
            data.aircraftRegistration?.toLocaleUpperCase();
          realmExistingFlight.aircraftType =
            data.aircraftType?.toLocaleUpperCase();
          realmExistingFlight.chargeNote.date = data.chargeNote.date;
          realmExistingFlight.chargeNote.currency.euroToMDL =
            data.chargeNote.currency.euroToMDL;
          realmExistingFlight.chargeNote.currency.usdToMDL =
            data.chargeNote.currency.usdToMDL;
          realmExistingFlight.crew = data?.crew;
          realmExistingFlight.chargeNote.paymentType =
            data?.chargeNote.paymentType?.toLocaleUpperCase();
          realmExistingFlight.chargeNote.billingTo = data.chargeNote.billingTo;
          realmExistingFlight.chargeNote.disbursementPercentage = Number(
            data.chargeNote.disbursementPercentage
          );
          realmExistingFlight.departure = data?.departure;
          realmExistingFlight.flightNumber =
            data?.flightNumber?.toLocaleUpperCase();
          realmExistingFlight.handlingType = data?.handlingType;
          realmExistingFlight.isCommercialFlight = data?.isCommercialFlight;
          realmExistingFlight.mtow = Number(data?.mtow);
          realmExistingFlight.operatorName = data?.operatorName;
          realmExistingFlight.orderingCompanyName = data?.orderingCompanyName;
          realmExistingFlight.parkingPosition =
            data?.parkingPosition?.toLocaleUpperCase();
          // realmExistingFlight.providedServices = undefined;
          realmExistingFlight.ramp = undefined;
          realmExistingFlight.scheduleType = data?.scheduleType;
          realmExistingFlight.status = data?.status;
        });
        dispatch(setCurrentFlightById(data.flightId as any));
      }
      snackbar.showSnackbar("General details saved successfully");

      //need to see based on flight plan type
      router.navigate(
        data?.handlingType === "Departure"
          ? "/(createFlight)/departure"
          : "/(createFlight)/arrival"
      );
    } catch (e) {
      Alert.alert(
        "Error saving general flight details",
        JSON.stringify(e, null, 2)
      );
    }
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
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              {/* <TextInput
                label="Operator Name"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.operatorName && true}
              /> */}
              {/* <DropDown
                label={"Operator name"}
                mode={"outlined"}
                visible={handleOperatorNameDropdownVisible}
                showDropDown={() => setHandleOperatorNameDropdownVisible(true)}
                onDismiss={() => setHandleOperatorNameDropdownVisible(false)}
                value={value}
                setValue={(value) => {
                  onChange(value);
                }}
                list={(
                  operatorBillingInformations.toJSON() as IBillingOperator[]
                ).map((o) => ({
                  label: o.operatorName,
                  value: o.operatorName,
                }))}
              /> */}
              <Autocomplete
                multiple={false}
                value={value}
                defaultValue={value}
                inputLabel={"Operator Name"}
                onChange={(v) => {
                  handleOperatorNameOptionSelect(v);
                  onChange(v);
                }}
                onChangeText={(v) => onChange(v)}
                options={(
                  operatorBillingInformations.toJSON() as IBillingOperator[]
                ).map((o) => ({
                  label: o.operatorName,
                  value: o.operatorName,
                }))}
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
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Flight number"
                style={styles.input}
                autoCapitalize="characters"
                value={String(value)}
                onChangeText={(value) => onChange(String(value))}
                onBlur={onBlur}
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
                    return (
                      <RadioButton.Item key={key} label={key} value={key} />
                    );
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
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <Autocomplete
                multiple={false}
                value={value}
                defaultValue={value}
                inputLabel={"Ordering company name"}
                onChange={(v) => onChange(v)}
                onChangeText={(v) => onChange(v)}
                options={(
                  operatorBillingInformations.toJSON() as IBillingOperator[]
                ).map((o) => ({
                  label: o.operatorName,
                  value: o.operatorName,
                }))}
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
                autoCapitalize="characters"
                value={String(value)}
                onChangeText={(value) => onChange(String(value))}
                onBlur={onBlur}
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
                autoCapitalize="characters"
                onBlur={onBlur}
                onChangeText={(value) => {
                  onChange(value);
                }}
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
                autoCapitalize="characters"
                value={String(value)}
                onChangeText={(value) => onChange(String(value))}
                onBlur={onBlur}
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
                value={value ? String(value) : ""}
                keyboardType="number-pad"
                onBlur={onBlur}
                onChangeText={(value) => onChange(Number(onlyIntNumber(value)))}
                error={errors.mtow && true}
              />
              <HelperText type="error">{errors.mtow?.message}</HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="chargeNote.paymentType"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Payment type:"
                style={formStyles.input}
                value={value}
                autoCapitalize="characters"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.arrival?.from && true}
              />
              <HelperText type="error">
                {errors.arrival?.from?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="chargeNote.billingTo"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Billing to:"
                style={{ ...formStyles.input }}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.chargeNote?.billingTo && true}
                multiline={true}
                maxLength={250}
                numberOfLines={5} // Optional: Set the number of lines to display
              />
              <HelperText type="error">
                {errors?.chargeNote?.billingTo?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="chargeNote.currency.euroToMDL"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Invalid number format",
              value: REGEX.number,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="EURO to MDL rate"
                style={formStyles.input}
                value={value}
                onBlur={onBlur}
                keyboardType="numeric"
                onChangeText={(value) => onChange(replaceCommaWithDot(value))}
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
            pattern: {
              message: "Invalid number format",
              value: REGEX.number,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="USD to MDL rate"
                style={formStyles.input}
                value={value}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(replaceCommaWithDot(value))}
                error={errors?.chargeNote?.currency?.usdToMDL && true}
              />
              <HelperText type="error">
                {errors.chargeNote?.currency?.usdToMDL?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={10}
          name="chargeNote.disbursementPercentage"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Invalid number format",
              value: REGEX.number,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Disbursement percentage:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(onlyIntNumber(value))}
                error={errors?.chargeNote?.disbursementPercentage && true}
              />
              <HelperText type="error">
                {errors?.chargeNote?.disbursementPercentage?.message}
              </HelperText>
            </>
          )}
        />
        <Button
          mode="contained"
          onPress={handleSubmit(submit)}
          disabled={!formState.isValid}
          loading={formState.isSubmitting}
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
