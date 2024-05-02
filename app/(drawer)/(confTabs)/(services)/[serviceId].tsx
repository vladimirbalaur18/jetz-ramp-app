import { useSnackbar } from "@/context/snackbarContext";
import { IService, ServiceCategorySchema } from "@/models/Services";
import { useQuery, useRealm } from "@realm/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
const ERROR_MESSAGES = {
  REQUIRED: "This Field Is Required",
  NAME_INVALID: "Not a Valid Name",
  TERMS: "Terms Must Be Accepted To Continue",
  EMAIL_INVALID: "Not a Valid Email",
};
type FormData = Omit<IService, "pricing"> & {
  amount: number;
  currency: string;
};
const Form: React.FC = () => {
  const { serviceId } = useLocalSearchParams();
  const [currentService] = useQuery<IService>(
    "Service",
    (collection) => collection.filtered("serviceId == $0", serviceId),
    [serviceId]
  );
  const allServiceCategories = useQuery<ServiceCategorySchema>("Services");
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

      for (const category of allServiceCategories) {
        if (!category.services.length) {
          realm.delete(category);
        }
      }
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
