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
  Text,
  useTheme,
  Portal,
  Modal,
  Icon,
} from "react-native-paper";
import { ObjectId } from "bson";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import DropDown from "react-native-paper-dropdown";
import { useQuery, useRealm } from "@realm/react";
import { IService } from "@/models/Services";
import { useSnackbar } from "@/context/snackbarContext";
import uuid from "react-uuid";
import { IServiceCategory } from "@/models/ServiceCategory";
import { errorPrint } from "@/utils/errorPrint";
const ERROR_MESSAGES = {
  REQUIRED: "This Field Is Required",
  NAME_INVALID: "Not a Valid Name",
  TERMS: "Terms Must Be Accepted To Continue",
  EMAIL_INVALID: "Not a Valid Email",
};
type FormData = Omit<IService, "pricing"> & {
  amount: number;
  currency: string;
  serviceCategoryName: string;
};
const NewService: React.FC = () => {
  const serviceCategories = useQuery<IServiceCategory>("ServiceCategory");
  const realm = useRealm();

  const theme = useTheme();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { control, formState, handleSubmit, getValues, reset, watch } =
    useForm<FormData>({
      mode: "onBlur",
      defaultValues: {
        serviceName: "",
        amount: 0,
      },
    });
  const formValues = watch();

  const handleServiceSubmit = () => {
    for (let serviceCategory of serviceCategories) {
      if (formValues.serviceCategoryName === serviceCategory.categoryName) {
        try {
          realm.write(() => {
            serviceCategory.services.push(
              realm.create<IService>("Service", {
                _id: new ObjectId(),
                hasVAT: formValues.hasVAT,
                isDisbursed: formValues.isDisbursed,
                price: Number(formValues.amount),
                serviceName: formValues.serviceName,
                categoryName: serviceCategory.categoryName,
              })
            );
          });
        } catch (e) {
          errorPrint("Error creating service", e);
        }
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
      label: c.categoryName,
      value: c.categoryName,
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
                  {
                    label: "Create new category",
                    value: "newCategory",
                    custom: (
                      <Text style={{ color: theme.colors.primary }}>
                        <Icon
                          source={"archive-plus-outline"}
                          size={18}
                          color={theme.colors.primary}
                        />
                        {"   "}
                        Create a new category
                      </Text>
                    ),
                  },
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
              if (values.serviceCategoryName === serviceCategory.categoryName) {
                alert("This category already exists");
                setShowAddCategoryModal(false);

                return;
              }
            }

            try {
              realm.write(() => {
                realm.create<IServiceCategory>("ServiceCategory", {
                  _id: new ObjectId(),
                  categoryName: values.serviceCategoryName,
                });
              });
              showSnackbar("Category created successfully");
              setShowAddCategoryModal(false);
            } catch (e) {
              errorPrint("Error creating new service category", e);
            }
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
      mode: "onBlur",
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
          <Text style={{ marginBottom: 20 }} variant="bodyLarge">
            Create a new category
          </Text>

          <Controller
            control={control}
            name="serviceCategoryName"
            rules={{
              required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            }}
            render={({ field: { onBlur, onChange, value } }) => (
              <>
                <TextInput
                  label="Category name:"
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
              alignItems: "center",
            }}
          >
            <Button
              mode="outlined"
              onPress={() => {
                onDismiss();
              }}
              style={{ width: 190 }}
            >
              <Text> Close</Text>
            </Button>
            <Button
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
