import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Button,
  Divider,
  HelperText,
  TextInput,
  Text,
  useTheme,
} from "react-native-paper";
import { IBillingOperator } from "@/models/billingOperators";
import { Controller, useForm } from "react-hook-form";
import ERROR_MESSAGES from "@/utils/formErrorMessages";

export type IOperatorInput = {
  id: Realm.BSON.ObjectId;
  operatorName: string;
  billingInfo: string;
  onFieldRemovePress?: (id: Realm.BSON.ObjectId) => void;
  onFieldCreatePress?: (data: IBillingOperator) => void;
  onFieldUpdatePress?: (data: IBillingOperator) => void;
  isNewRule?: boolean;
};
export const OperatorInput: React.FC<IOperatorInput> = ({
  operatorName,
  billingInfo,
  onFieldRemovePress,
  onFieldCreatePress,
  onFieldUpdatePress,
  isNewRule = false,
  id,
}) => {
  const { control, formState, handleSubmit, getValues, watch } =
    useForm<IBillingOperator>({
      mode: "onChange",
      defaultValues: {
        operatorName,
        billingInfo,
      },
    });
  const { errors } = formState;
  const theme = useTheme();
  const formValues = watch();
  const [scope, setScope] = useState<"view" | "create" | "edit">(
    !isNewRule ? "view" : "create"
  );
  const handleRuleEdit = () => {
    onFieldUpdatePress && onFieldUpdatePress({ ...formValues, _id: id });
    setScope("view");
  };
  const handleRuleCreate = () => {
    onFieldCreatePress && onFieldCreatePress(formValues);
    setScope("view");
  };
  const handleRemoveRule = () => {
    onFieldRemovePress && onFieldRemovePress(id);
  };
  const EditButton = ({ onPress }: any) => {
    return (
      <Button
        mode="contained"
        onPress={onPress}
        icon={"clipboard-edit-outline"}
      >
        Edit
      </Button>
    );
  };
  const SubmitButton = () => {
    return (
      <Button
        mode="contained"
        onPress={scope === "edit" ? handleRuleEdit : handleRuleCreate}
        // icon={signButtonIconName}
      >
        Submit
      </Button>
    );
  };
  const RemoveButton = () => {
    return (
      <Button
        mode="contained-tonal"
        icon={"clipboard-remove-outline"}
        buttonColor={theme.colors.errorContainer}
        onPress={handleRemoveRule}
      >
        {scope === "view" ? "Remove" : "Dismiss"}
      </Button>
    );
  };
  const DismissButton = () => {
    return <Button onPress={() => setScope("view")}>Cancel</Button>;
  };

  return (
    <>
      <View>
        <Controller
          control={control}
          name="operatorName"
          defaultValue={operatorName}
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Operator name"
                style={styles.input}
                value={String(value)}
                disabled={scope === "view"}
                onBlur={onBlur}
                keyboardType="numeric"
                onChangeText={(text) => onChange(text)}
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
          name="billingInfo"
          defaultValue={billingInfo}
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Billinf information"
                style={styles.input}
                disabled={scope === "view"}
                value={String(value)}
                onBlur={onBlur}
                multiline={true}
                numberOfLines={5}
                onChangeText={(text) => onChange(text)}
                error={errors.billingInfo && true}
              />
              <HelperText type="error">
                {errors.billingInfo?.message}
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
        <Divider style={{ marginVertical: 20 }} />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    paddingVertical: 30,
    // height: "100%",
  },
  input: { marginVertical: 5 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
});
