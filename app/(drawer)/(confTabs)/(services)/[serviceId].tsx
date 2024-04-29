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
  useTheme,
} from "react-native-paper";
import { Flight, ProvidedServices } from "@/redux/types";
import {
  useForm,
  Controller,
  useFieldArray,
  UseFieldArrayRemove,
  Control,
  FieldErrors,
  useWatch,
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
import formStyles from "@/styles/formStyles";
import { useObject, useQuery, useRealm } from "@realm/react";
import { ProvidedServicesSchema, ServiceSchema } from "@/models/Services";
import { useSnackbar } from "@/context/snackbarContext";
type FormData = Omit<ServiceSchema, "pricing"> & {
  amount: number;
  currency: string;
};
const Form: React.FC = () => {
  const { serviceId } = useLocalSearchParams();
  const [currentService] = useQuery<ServiceSchema>(
    "Service",
    (collection) => collection.filtered("serviceId == $0", serviceId),
    [serviceId]
  );
  const realm = useRealm();

  const theme = useTheme();
  const router = useRouter();
  const [scope, setScope] = useState<"view" | "edit">("view");
  const { showSnackbar } = useSnackbar();
  const { control, formState, handleSubmit, getValues, reset, watch } =
    useForm<FormData>({
      mode: "onChange",
      defaultValues: {
        serviceName: currentService?.serviceName,
        amount: currentService?.pricing.amount,
        hasVAT: currentService?.hasVAT,
        isDisbursed: currentService?.isDisbursed,
        currency: currentService?.pricing.currency,
      },
    });
  const formValues = watch();
  const handleServiceEdit = () => {};
  const handleServiceRemove = () => {
    realm.write(() => {
      showSnackbar(`${currentService.serviceName} has been removed`);
      realm.delete(currentService);
      router.back();
    });
  };
  const handleServiceSubmit = () => {
    realm.write(() => {
      currentService.serviceName = formValues.serviceName;
      currentService.pricing.amount = Number(formValues.amount);
      currentService.hasVAT = formValues.hasVAT;
      currentService.isDisbursed = formValues.isDisbursed;
      showSnackbar(`Services has been updated successfully`);
      setScope("view");
    });
  };
  const disableField = scope === "view";

  const EditButton = ({ onPress }: any) => {
    return (
      <Button
        mode="contained"
        onPress={onPress}
        icon={"clipboard-edit-outline"}
      >
        Edit service
      </Button>
    );
  };

  const RemoveButton = () => {
    return (
      <Button
        mode="contained-tonal"
        icon={"clipboard-remove-outline"}
        buttonColor={theme.colors.errorContainer}
        onPress={handleServiceRemove}
      >
        Remove service
      </Button>
    );
  };
  const DismissButton = () => {
    return (
      <Button
        onPress={() => {
          reset();
          setScope("view");
        }}
      >
        Cancel
      </Button>
    );
  };
  const SubmitButton = () => {
    return (
      <Button
        mode="contained"
        onPress={handleServiceSubmit}
        // icon={signButtonIconName}
      >
        Save changes
      </Button>
    );
  };

  const { errors } = formState;
  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
        alwaysBounceVertical={false}
      >
        <Controller
          control={control}
          name="serviceName"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Service name"
                style={styles.input}
                disabled={disableField}
                value={String(value)}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.serviceName && true}
              />
              <HelperText type="error">
                {errors?.serviceName?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          name="amount"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Amount"
                style={styles.input}
                value={String(value)}
                onBlur={onBlur}
                disabled={disableField}
                onChangeText={(value) => onChange(value)}
                error={errors?.amount && true}
              />
              {/* <HelperText type="error">
                {errors?.pricing?.amount?.message}
              </HelperText> */}
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyLarge">Is VAT applicable?</Text>
          <Controller
            control={control}
            defaultValue={false}
            name="hasVAT"
            render={({ field: { value, onChange } }) => (
              <>
                <Switch
                  value={value}
                  disabled={disableField}
                  onValueChange={(value) => onChange(value)}
                />
              </>
            )}
          />
        </View>
        <View style={styles.row}>
          <Text variant="bodyLarge">Is disbursed </Text>
          <Controller
            control={control}
            defaultValue={false}
            name="isDisbursed"
            render={({ field: { value, onChange } }) => (
              <>
                <Switch
                  value={value}
                  disabled={disableField}
                  onValueChange={(value) => onChange(value)}
                />
              </>
            )}
          />
        </View>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            marginVertical: 10,
            alignItems: "center",
          }}
        >
          {scope === "edit" ? <DismissButton /> : <RemoveButton />}
          {scope === "view" ? (
            <EditButton
              onPress={() => {
                setScope("edit");
              }}
            />
          ) : (
            <SubmitButton />
          )}
        </View>
        {/* <Controller
          control={control}
          name="pricing.amount"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Pricing amount:"
                style={styles.input}
                value={String(value)}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.pricing?.amount && true}
              />
              <HelperText type="error">
                {errors?.pricing?.amount?.message}
              </HelperText>
            </>
          )}
        /> */}
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
