import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import {
  Button,
  Divider,
  HelperText,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import { GeneralConfigState } from "@/models/Config";
import { FuelFeesState } from "@/models/Fuelfees";
import { BasicHandlingSchema } from "@/models/BasicHandling";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import REGEX from "@/utils/regexp";
import { useSnackbar } from "@/context/snackbarContext";
function useForceRender() {
  const [, setTick] = useState(0);
  return () => setTick((tick) => tick + 1);
}
type FormData = {
  BasicHandlingFees: (BasicHandlingSchema & { alreadyExists: boolean })[];
};
const Form: React.FC = () => {
  const [forceRenderIndex, setForceRender] = useState(0);
  let basicHandlingFees =
    useQuery<BasicHandlingSchema>("BasicHandling").sorted("minMTOW");
  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
  });
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const fieldArray = useFieldArray<FormData>({
    control: control,
    name: "BasicHandlingFees",
  });

  useEffect(() => {
    basicHandlingFees.forEach((fee, index) => {
      fieldArray.append({ ...fee, alreadyExists: true });
    });

    return () => fieldArray.remove();
  }, [basicHandlingFees.length, forceRenderIndex]);
  const { showSnackbar } = useSnackbar();

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        alwaysBounceVertical={false}
      >
        <View style={styles.row}>
          <Text variant="headlineSmall">Basic handling prices: </Text>
        </View>
        {fieldArray.fields.map((fee) => {
          return (
            <BasicHandlingInput
              {...fee}
              disabled={fee.alreadyExists}
              onFieldCreatePress={() => {
                showSnackbar("Rule created successfully");

                setForceRender(forceRenderIndex + 1);
                fieldArray.remove();
              }}
              onFieldUpdatePress={() => {
                showSnackbar("Rule updated successfully");

                setForceRender(forceRenderIndex + 1);
                fieldArray.remove();
              }}
              onFieldRemovePress={() => {
                showSnackbar("Rule has been removed successfully");
                setSnackbarVisible(true);
                setForceRender(forceRenderIndex + 1);
                fieldArray.remove();
              }} //removes all fields to re-render them again from the database accordingly from useEffect
            />
          );
        })}
        <Button
          mode="contained"
          disabled={fieldArray.fields.at(-1)?.alreadyExists === false}
          icon={"clipboard-plus-outline"}
          onPress={() =>
            fieldArray.append({
              //@ts-expect-error: Passing empty data instead of type number
              minMTOW: "",
              //@ts-expect-error: Passing empty data instead of type number
              maxMTOW: "", //@ts-expect-error: Passing empty data instead of type number
              pricePerLeg: "",
              alreadyExists: false,
            })
          }
        >
          Add new rule
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

function BasicHandlingInput({
  minMTOW,
  maxMTOW,
  pricePerLeg,
  onFieldRemovePress,
  onFieldCreatePress,
  onFieldUpdatePress,
  disabled: alreadyExistingRule = false,
}: any) {
  const theme = useTheme();
  const { control, formState, handleSubmit, getValues, watch, getFieldState } =
    useForm<BasicHandlingSchema>({
      mode: "onChange",
      defaultValues: {
        minMTOW,
        maxMTOW,
        pricePerLeg,
      },
    });
  const formValues = watch();
  const realm = useRealm();
  const { errors } = formState;
  const fees = useQuery<BasicHandlingSchema>("BasicHandling");
  const [scope, setScope] = useState<"view" | "create" | "edit">(
    alreadyExistingRule ? "view" : "create"
  );
  const handleRemoveRule = () => {
    //remove uncompleted inputs before touching DB
    if (
      !alreadyExistingRule ||
      isNaN(formValues.maxMTOW) ||
      isNaN(formValues.minMTOW)
    ) {
      return onFieldRemovePress();
    } else {
      realm.write(() => {
        const feeToRemove = fees.find(
          (f) =>
            f.maxMTOW == Number(maxMTOW) &&
            f.minMTOW == Number(minMTOW) &&
            f.pricePerLeg == Number(pricePerLeg)
        );
        if (feeToRemove) {
          realm.delete(feeToRemove);
          onFieldRemovePress && onFieldRemovePress();
        }
      });
    }
  };

  const handleRuleSubmit = () => {
    if (Number(formValues.minMTOW) >= Number(formValues.maxMTOW)) {
      alert(
        `Max MTOW must be greater than Min MTOW ${formValues.maxMTOW} ${formValues.minMTOW}`
      );

      return;
    } else
      realm.write(() => {
        if (isFeeMTOWRangeOverlapping(formValues, [...fees])) {
          alert(
            "This rule is conflicting with already existing rules. Please check."
          );

          return;
        }

        onFieldCreatePress && onFieldCreatePress();
        realm.create("BasicHandling", {
          minMTOW: Number(formValues.minMTOW),
          maxMTOW: Number(formValues.maxMTOW),
          pricePerLeg: Number(formValues.pricePerLeg),
        });
        setScope("view");
      });
  };

  const handleRuleEdit = () => {
    for (let fee of fees) {
      realm.write(() => {
        if (compareBasicHandlingFees(fee, formValues)) {
          fee.pricePerLeg = Number(formValues.pricePerLeg);
          return;
        }
      });
    }

    onFieldUpdatePress && onFieldUpdatePress();
  };

  const EditButton = ({ onPress }: any) => {
    return (
      <Button
        mode="contained"
        onPress={onPress}
        icon={"clipboard-edit-outline"}
      >
        Edit price
      </Button>
    );
  };

  const SubmitButton = () => {
    return (
      <Button
        mode="contained"
        onPress={scope === "edit" ? handleRuleEdit : handleRuleSubmit}
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
        Remove rule
      </Button>
    );
  };
  const DismissButton = () => {
    return <Button onPress={() => setScope("view")}>Cancel</Button>;
  };

  return (
    <View>
      <Controller
        control={control}
        name="minMTOW"
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          pattern: {
            message: "Please insert correct format",
            value: REGEX.number,
          },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label="Minimum MTOW (kg)"
              style={styles.input}
              value={String(value)}
              disabled={alreadyExistingRule}
              onBlur={onBlur}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text)}
              error={errors.minMTOW && true}
            />
            <HelperText type="error">{errors.minMTOW?.message}</HelperText>
          </>
        )}
      />
      <Controller
        control={control}
        name="maxMTOW"
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          pattern: {
            message: "Please insert correct format",
            value: REGEX.number,
          },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label="Maximum MTOW (kg)"
              style={styles.input}
              disabled={alreadyExistingRule}
              value={String(value)}
              onBlur={onBlur}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text)}
              error={errors.maxMTOW && true}
            />
            <HelperText type="error">{errors.maxMTOW?.message}</HelperText>
          </>
        )}
      />
      <Controller
        control={control}
        name="pricePerLeg"
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          pattern: {
            message: "Please insert correct format",
            value: REGEX.number,
          },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label="Price per leg (EUR)"
              style={styles.input}
              value={String(value)}
              disabled={alreadyExistingRule && scope !== "edit"}
              onBlur={onBlur}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text)}
              error={errors.pricePerLeg && true}
            />
            <HelperText type="error">{errors.pricePerLeg?.message}</HelperText>
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
  );
}

const isFeeMTOWRangeOverlapping = (
  { minMTOW, maxMTOW }: BasicHandlingSchema,
  fees: BasicHandlingSchema[]
): boolean => {
  for (const fee of fees) {
    if (
      (minMTOW >= fee.minMTOW && minMTOW < fee.maxMTOW) ||
      (maxMTOW > fee.minMTOW && maxMTOW <= fee.maxMTOW)
    )
      return true;
  }
  return false;
};
const compareBasicHandlingFees = (
  { minMTOW, maxMTOW }: BasicHandlingSchema,
  compareFee: BasicHandlingSchema
): boolean => {
  return (
    Number(minMTOW) === Number(compareFee.minMTOW) &&
    Number(maxMTOW) === Number(compareFee.maxMTOW)
  );
};
export default Form;

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
