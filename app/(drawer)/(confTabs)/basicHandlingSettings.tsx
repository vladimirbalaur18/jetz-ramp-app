import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import {
  Button,
  Divider,
  HelperText,
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

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        alwaysBounceVertical={false}
      >
        <View style={styles.row}>
          <Text variant="headlineSmall">Basic handling prices: </Text>
        </View>
        <Text>{JSON.stringify(basicHandlingFees)}</Text>
        {fieldArray.fields.map((fee) => {
          return (
            <BasicHandlingInput
              {...fee}
              alreadyExists={fee.alreadyExists}
              onFieldRemove={() => {
                setForceRender(forceRenderIndex + 1);
                fieldArray.remove();
              }} //removes all fields to re-render them again from the database accordingly
            />
          );
        })}
        <Button
          mode="contained"
          disabled={fieldArray.fields.at(-1)?.alreadyExists === false}
          icon={"clipboard-plus-outline"}
          onPress={() =>
            fieldArray.append({
              //@ts-expect-error

              minMTOW: null,
              //@ts-expect-error
              maxMTOW: null, //@ts-expect-error
              pricePerLeg: null,
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
  onFieldRemove,
  alreadyExists = false,
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
              disabled={alreadyExists}
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
              disabled={alreadyExists}
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
              disabled={alreadyExists}
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
        <Button
          mode="contained-tonal"
          icon={"clipboard-remove-outline"}
          buttonColor={theme.colors.errorContainer}
          onPress={() => {
            if (
              !alreadyExists ||
              isNaN(formValues.maxMTOW) ||
              isNaN(formValues.minMTOW)
            ) {
              return onFieldRemove();
            }

            realm.write(() => {
              const fee = realm
                .objects<BasicHandlingSchema>("BasicHandling")
                .find(
                  (f) =>
                    f.maxMTOW == Number(maxMTOW) &&
                    f.minMTOW == Number(minMTOW) &&
                    f.pricePerLeg == Number(pricePerLeg)
                );
              console.log("fee", fee);
              if (fee) {
                realm.delete(fee);
                onFieldRemove && onFieldRemove();
              }
            });
          }}
        >
          Remove rule
        </Button>
        {!alreadyExists && (
          <Button
            disabled={!formState.isValid}
            mode="contained"
            onPress={() => {
              if (formValues.minMTOW >= formValues.maxMTOW) {
                alert(
                  `Max MTOW must be greater than Min MTOW ${formValues.maxMTOW} ${formValues.minMTOW}`
                );

                return;
              }
              realm.write(() => {
                const fees =
                  realm.objects<BasicHandlingSchema>("BasicHandling");

                for (let fee of fees) {
                  if (
                    fee.minMTOW === Number(formValues.minMTOW) &&
                    fee.maxMTOW === Number(formValues.maxMTOW)
                  ) {
                    fee.pricePerLeg = Number(formValues.pricePerLeg);
                    return;
                  }
                }

                if (
                  fees.some(
                    (fee) =>
                      (formValues.minMTOW >= fee.maxMTOW &&
                        formValues.maxMTOW <= fee.minMTOW) ||
                      (formValues.minMTOW <= fee.maxMTOW &&
                        fee.maxMTOW <= formValues.maxMTOW)
                  )
                ) {
                  alert(
                    "This rule is conflicting with already existing rules. Please check."
                  );

                  return;
                }

                onFieldRemove && onFieldRemove();
                realm.create("BasicHandling", {
                  minMTOW: Number(formValues.minMTOW),
                  maxMTOW: Number(formValues.maxMTOW),
                  pricePerLeg: Number(formValues.pricePerLeg),
                });
              });
            }}
            // icon={signButtonIconName}
          >
            Submit
          </Button>
        )}
      </View>
      <Divider style={{ marginVertical: 20 }} />
    </View>
  );
}

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
