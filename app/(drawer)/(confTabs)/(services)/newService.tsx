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
  Portal,
  Modal,
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
import uuid from "react-uuid";
type FormData = Omit<ServiceSchema, "pricing"> & {
  amount: number;
  currency: string;
  serviceCategoryName: string;
};
const NewService: React.FC = () => {
  const serviceCategories = useQuery<ProvidedServicesSchema>("Services");
  const realm = useRealm();

  const theme = useTheme();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { control, formState, handleSubmit, getValues, reset, watch } =
    useForm<FormData>({
      mode: "onChange",
      defaultValues: {
        serviceName: "",
        amount: 0,
      },
    });
  const formValues = watch();

  const handleServiceSubmit = () => {
    for (let serviceCategory of serviceCategories) {
      if (
        formValues.serviceCategoryName === serviceCategory.serviceCategoryName
      ) {
        realm.write(() => {
          serviceCategory.services.push(
            realm.create<ServiceSchema>("Service", {
              serviceId: uuid(),
              hasVAT: formValues.hasVAT,
              isDisbursed: formValues.isDisbursed,
              pricing: {
                currency: "EUR",
                amount: Number(formValues.amount),
              },
              serviceName: formValues.serviceName,
            })
          );
        });
      }
    }
    reset();
    showSnackbar(`Services has been added successfully`);
  };

  const SubmitButton = () => {
    return (
      <Button
        mode="contained"
        onPress={handleServiceSubmit}
        disabled={!formState.isValid}
        // icon={signButtonIconName}
      >
        Save changes
      </Button>
    );
  };

  const { errors } = formState;
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const categoriesOptions = serviceCategories.map((c) => {
    return {
      label: c.serviceCategoryName,
      value: c.serviceCategoryName,
    };
  });
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
          defaultValue={""}
          name="serviceCategoryName"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <View style={styles.input}>
              <DropDown
                label={"Choose service category"}
                mode={"outlined"}
                visible={showCategoriesDropdown}
                showDropDown={() => setShowCategoriesDropdown(true)}
                onDismiss={() => setShowCategoriesDropdown(false)}
                value={value}
                setValue={(value) => {
                  if (value === "newCategory") {
                    setShowAddCategoryModal(true);
                  } else onChange(value);
                }}
                list={[
                  ...categoriesOptions,
                  { label: "Create new category", value: "newCategory" },
                ]}
              />
              <HelperText type="error">
                {errors?.serviceCategoryName?.message}
              </HelperText>
            </View>
          )}
        />
        <AddCategoryModal
          visible={showAddCategoryModal}
          onDismiss={() => setShowAddCategoryModal(false)}
          onSubmit={(values) => {
            for (const serviceCategory of serviceCategories) {
              if (
                values.serviceCategoryName ===
                serviceCategory.serviceCategoryName
              ) {
                alert("This category already exists");
                setShowAddCategoryModal(false);

                return;
              }
            }

            realm.write(() => {
              realm.create<ProvidedServicesSchema>("Services", {
                serviceCategoryName: values.serviceCategoryName,
                services: [],
              });
            });
            setShowAddCategoryModal(false);
          }}
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
                keyboardType="numeric"
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
          <SubmitButton />
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

export default NewService;

const AddCategoryModal = ({
  visible = false,
  onDismiss = () => {},
  onSubmit = (values: { serviceCategoryName: string }) => {},
}) => {
  const theme = useTheme();
  const { control, formState, handleSubmit, getValues, reset, watch } =
    useForm<{
      serviceCategoryName: string;
    }>({
      mode: "onChange",
      defaultValues: {
        serviceCategoryName: "",
      },
    });

  const { errors } = formState;
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          padding: 20,
          backgroundColor: "transparent",
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.surface,
            height: 250,
            padding: 30,
            justifyContent: "center",
            borderRadius: 15,
          }}
        >
          <Text variant="bodyLarge">Create new category</Text>

          <Controller
            control={control}
            name="serviceCategoryName"
            rules={{
              required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            }}
            render={({ field: { onBlur, onChange, value } }) => (
              <>
                <TextInput
                  label="Category:"
                  style={styles.input}
                  value={String(value)}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  error={errors?.serviceCategoryName && true}
                />
                <HelperText type="error">
                  {errors?.serviceCategoryName?.message}
                </HelperText>
              </>
            )}
          />

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginVertical: 10,
              alignItems: "center",
            }}
          >
            <Button
              onPress={() => {
                onDismiss();
              }}
            >
              Reset
            </Button>
            <Button
              style={{ marginVertical: 20 }}
              mode="contained"
              disabled={!formState.isValid}
              onPress={() => {
                onSubmit(watch());
              }}
            >
              Submit
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

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
