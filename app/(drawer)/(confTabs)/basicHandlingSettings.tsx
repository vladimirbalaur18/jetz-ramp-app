import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  FlatList,
  InteractionManager,
} from "react-native";
import {
  Button,
  Divider,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useTheme as useAppTheme } from "@react-navigation/native";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useQuery, useRealm } from "@realm/react";
import { IBasicHandlingRule } from "@/models/BasicHandlingRule";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import REGEX from "@/utils/regexp";
import { useSnackbar } from "@/context/snackbarContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type FormData = {
  BasicHandlingFees: (IBasicHandlingRule & { alreadyExists: boolean })[];
};
const Form: React.FC = () => {
  const [forceRenderIndex, setForceRender] = useState(0);
  let basicHandlingFees =
    useQuery<IBasicHandlingRule>("BasicHandlingRule").sorted("minMTOW");
  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onBlur",
  });
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const fieldArray = useFieldArray<FormData>({
    control: control,
    name: "BasicHandlingFees",
  });

  useEffect(() => {
    InteractionManager.setDeadline(100);
    InteractionManager.runAfterInteractions(() => {
      console.log("running ineraction");
      basicHandlingFees.forEach((fee, index) => {
        fieldArray.append({ ...fee, alreadyExists: true });
      });
    });

    return () => fieldArray.remove();
  }, [basicHandlingFees.length, forceRenderIndex]);
  const { showSnackbar } = useSnackbar();
  const realm = useRealm();

  const EmptyList = () => {
    const iconColor = useAppTheme().colors.text;

    return (
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          marginTop: "50%",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          opacity: 0.2,
        }}
      >
        <MaterialCommunityIcons name="airport" size={68} color={iconColor} />
        <Text variant="headlineSmall">No rules yet</Text>
      </View>
    );
  };
  return (
    <SafeAreaView>
      {/* <ScrollView
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
              key={fee.id}
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
                const feeToRemove = basicHandlingFees.find(
                  (f) =>
                    f.maxMTOW == Number(fee.maxMTOW) &&
                    f.minMTOW == Number(fee.minMTOW) &&
                    f.pricePerLeg == Number(fee.pricePerLeg)
                );
                if (feeToRemove)
                  Alert.alert(
                    "Remove rule?",
                    `Are you sure you want to remove this rule?`,
                    [
                      {
                        text: "Confirm",
                        onPress: () => {
                          try {
                            realm.write(() => {
                              if (feeToRemove) {
                                realm.delete(feeToRemove);
                                showSnackbar(
                                  "Rule has been removed successfully"
                                );
                                setSnackbarVisible(true);
                              }
                            });
                          } catch (e) {
                            Alert.alert(
                              "Error trying to remove fee",
                              JSON.stringify(e, null, 5)
                            );
                          }
                        },
                        style: "destructive",
                      },
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                    ],
                    {
                      cancelable: true,
                    }
                  );
                fieldArray.remove();
                setForceRender(forceRenderIndex + 1);
              }} //removes all fields to re-render them again from the database accordingly from useEffect
            />
          );
        })}
        <Button
          mode="elevated"
          disabled={fieldArray.fields.at(-1)?.alreadyExists === false}
          icon={"clipboard-plus-outline"}
          onPress={() =>
            fieldArray.append({
              minMTOW: +Number(fieldArray.fields.at(-1)?.maxMTOW) + 1,
              //@ts-expect-error: Passing empty data instead of type number
              maxMTOW: "", //@ts-expect-error: Passing empty data instead of type number
              pricePerLeg: "",
              alreadyExists: false,
            })
          }
        >
          Add new rule
        </Button>
      </ScrollView> */}
      <FlatList
        // ref={flatListRef}
        ListHeaderComponent={() => (
          <View style={styles.row}>
            <Text variant="headlineSmall">Basic handling prices: </Text>
          </View>
        )}
        ListEmptyComponent={EmptyList}
        data={fieldArray.fields}
        renderItem={({ item: fee }) => {
          return (
            <BasicHandlingInput
              {...fee}
              key={fee.id}
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
                const feeToRemove = basicHandlingFees.find(
                  (f) =>
                    f.maxMTOW == Number(fee.maxMTOW) &&
                    f.minMTOW == Number(fee.minMTOW) &&
                    f.pricePerLeg == Number(fee.pricePerLeg)
                );
                if (feeToRemove)
                  Alert.alert(
                    "Remove rule?",
                    `Are you sure you want to remove this rule?`,
                    [
                      {
                        text: "Confirm",
                        onPress: () => {
                          try {
                            realm.write(() => {
                              if (feeToRemove) {
                                realm.delete(feeToRemove);
                                showSnackbar(
                                  "Rule has been removed successfully"
                                );
                                setSnackbarVisible(true);
                              }
                            });
                          } catch (e) {
                            Alert.alert(
                              "Error trying to remove fee",
                              JSON.stringify(e, null, 5)
                            );
                          }
                        },
                        style: "destructive",
                      },
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                    ],
                    {
                      cancelable: true,
                    }
                  );
                fieldArray.remove();
                setForceRender(forceRenderIndex + 1);
              }} //removes all fields to re-render them again from the database accordingly from useEffect
            />
          );
        }}
        keyExtractor={(item, index) => item.id.toString()}
        contentContainerStyle={{
          padding: 10,
          gap: 30,
        }}
        ListFooterComponent={() => (
          <Button
            mode="elevated"
            disabled={fieldArray.fields.at(-1)?.alreadyExists === false}
            icon={"clipboard-plus-outline"}
            onPress={() => {
              InteractionManager.setDeadline(100);
              InteractionManager.runAfterInteractions(() => {
                fieldArray.append({
                  minMTOW: +Number(fieldArray.fields.at(-1)?.maxMTOW) + 1,
                  //@ts-expect-error: Passing empty data instead of type number
                  maxMTOW: "", //@ts-expect-error: Passing empty data instead of type number
                  pricePerLeg: "",
                  alreadyExists: false,
                });
              });
            }}
          >
            Add new rule
          </Button>
        )}
      />
    </SafeAreaView>
  );
};

function BasicHandlingInput({
  minMTOW,
  maxMTOW,
  pricePerLeg,
  notes,
  onFieldRemovePress,
  onFieldCreatePress,
  onFieldUpdatePress,
  disabled: alreadyExistingRule = false,
  n,
}: any) {
  const theme = useTheme();
  const { control, formState, handleSubmit, getValues, watch, getFieldState } =
    useForm<IBasicHandlingRule>({
      mode: "onBlur",
      defaultValues: {
        minMTOW,
        maxMTOW,
        pricePerLeg,
        notes,
      },
    });
  const formValues = watch();
  const realm = useRealm();
  const { errors } = formState;
  const fees = useQuery<IBasicHandlingRule>("BasicHandlingRule");
  const [scope, setScope] = useState<"view" | "create" | "edit">(
    alreadyExistingRule ? "view" : "create"
  );
  const handleRemoveRule = () => {
    InteractionManager.setDeadline(100);

    InteractionManager.runAfterInteractions(() => {
      onFieldRemovePress && onFieldRemovePress();
    });
  };

  const handleRuleSubmit = () => {
    if (Number(formValues.minMTOW) >= Number(formValues.maxMTOW)) {
      alert(
        `Max MTOW must be greater than Min MTOW ${formValues.maxMTOW} ${formValues.minMTOW}`
      );

      return;
    } else {
      try {
        realm.write(() => {
          if (isFeeMTOWRangeOverlapping(formValues, [...fees])) {
            alert(
              "This rule is conflicting with already existing rules. Please check."
            );

            return;
          }

          onFieldCreatePress && onFieldCreatePress();
          realm.create("BasicHandlingRule", {
            minMTOW: Number(formValues.minMTOW),
            maxMTOW: Number(formValues.maxMTOW),
            pricePerLeg: Number(formValues.pricePerLeg),
            notes: formValues.notes,
          });
          setScope("view");
        });
      } catch (e) {
        Alert.alert(
          "Error creating basic handling rule",
          JSON.stringify(e, null, 5)
        );
      }
    }
  };

  const handleRuleEdit = () => {
    InteractionManager.runAfterInteractions(() => {
      try {
        realm.write(() => {
          for (let fee of fees) {
            if (compareBasicHandlingFees(fee, formValues)) {
              fee.pricePerLeg = Number(formValues.pricePerLeg);
              fee.notes = formValues.notes;
              return;
            }
          }
        });
        onFieldUpdatePress && onFieldUpdatePress();
      } catch (e) {
        Alert.alert(
          "Error trying to update basic handling fee",
          JSON.stringify(e, null, 5)
        );
      }
    });
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
        {alreadyExistingRule ? "Remove rule" : "Dismiss rule"}
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
      <Controller
        control={control}
        name="notes"
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label="Notes:"
              style={styles.input}
              value={value}
              disabled={alreadyExistingRule && scope !== "edit"}
              onBlur={onBlur}
              onChangeText={(text) => onChange(text)}
              error={errors.notes && true}
              multiline={true}
              maxLength={250}
              numberOfLines={5} // Optional: Set the number of lines to display
            />
            <HelperText type="error">{errors.notes?.message}</HelperText>
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
  { minMTOW, maxMTOW }: IBasicHandlingRule,
  fees: IBasicHandlingRule[]
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
  { minMTOW, maxMTOW }: IBasicHandlingRule,
  compareFee: IBasicHandlingRule
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
