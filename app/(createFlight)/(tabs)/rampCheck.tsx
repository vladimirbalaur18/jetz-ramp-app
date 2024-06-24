import SectionTitle from "@/components/FormUtils/SectionTitle";
import { IFlight } from "@/models/Flight";
import { IProvidedService } from "@/models/ProvidedService";
import { updateFlight } from "@/redux/slices/flightsSlice";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState } from "@/redux/store";
import formStyles from "@/styles/formStyles";
import ArrDepTemplateRenderHTML from "@/utils/arrDepTemplate";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import { onlyIntNumber } from "@/utils/numericInputFormatter";
import printToFile from "@/utils/printToFile";
import rampChecklistHTML from "@/utils/rampChecklistTemplate";
import reampChecklistHTML from "@/utils/rampChecklistTemplate";
import REGEX from "@/utils/regexp";
import _selectCurrentFlight from "@/utils/selectCurrentFlight";
import { useRealm } from "@realm/react";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
export default function Page() {
  const realm = useRealm();

  const currentFlightId = useSelector(
    (state: RootState) => state.flights.currentFlightId
  );
  const realmExistingFlight = _selectCurrentFlight(currentFlightId || "");
  const existingFlightJSON = realmExistingFlight?.toJSON() as IFlight;
  const submit = (data: Partial<IFlight>) => {
    // dispatch(
    //   // updateFlight({
    //   //   ...existingFlightJSON,
    //   //   ...data,
    //   // })
    // );

    if (realmExistingFlight) realm.write(() => {});
  };
  const { control, formState, handleSubmit, getValues } = useForm<IFlight>({
    mode: "onChange",
    defaultValues: {
      providedServices: existingFlightJSON.providedServices,
    },
  });

  const submitRampChecklist = (data: Partial<IFlight>) => {
    submit(data);
    printToFile({
      html: rampChecklistHTML({ ...existingFlightJSON }),
      fileName: `rampChecklist_${existingFlightJSON?.flightNumber}_${existingFlightJSON?.aircraftRegistration}`,
      width: 500,
    });
  };

  const { fields, append, update } = useFieldArray({
    control,
    name: "providedServices.otherServices",
  });

  const mapServicesPerCategories = useMemo(() => {
    let result: Record<
      string,
      {
        serviceName: string;
        notes: IProvidedService["notes"];
        quantity: IProvidedService["quantity"];
        isUsed: IProvidedService["isUsed"];
      }[]
    > = {};

    realmExistingFlight?.providedServices?.otherServices?.map((s) => {
      const serviceObj = {
        serviceName: s.service.serviceName,
        notes: s.notes,
        quantity: s.quantity,
        isUsed: s.isUsed,
      };

      if (result[s.service.categoryName]) {
        result[s.service.categoryName].push({
          ...serviceObj,
        });
      } else result[s.service.categoryName] = [{ ...serviceObj }];
    });
  }, [realmExistingFlight]);

  useEffect(() => {
    existingFlightJSON?.providedServices?.otherServices?.forEach((s) => {
      append({
        service: s.service,
        isUsed: s.isUsed,
        isPriceOverriden: s.isPriceOverriden,
        quantity: s.quantity,
        notes: s.notes || "",
      });
    });
  }, []);

  const { errors } = formState;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>
        {existingFlightJSON.providedServices?.otherServices?.map((s) =>
          JSON.stringify(s, null, 3)
        )}
      </Text>
      {fields.map((field, serviceIndex, array) => {
        const {
          service,
          isPriceOverriden,
          isUsed,
          notes,
          quantity,
          totalPriceOverride,
        } = field;

        const { serviceName, hasVAT, price } = service;

        return (
          isUsed === true && (
            <>
              {
                <>
                  {field.service.categoryName !==
                    array[serviceIndex - 1]?.service?.categoryName && (
                    <SectionTitle>{field.service.categoryName}</SectionTitle>
                  )}

                  <View style={{ marginVertical: 10 }}>
                    <Text variant="bodyMedium">{service.serviceName}</Text>
                    <Controller
                      control={control}
                      defaultValue={1}
                      name={`providedServices.otherServices.${serviceIndex}.quantity`}
                      rules={{
                        required: {
                          value: true,
                          message: ERROR_MESSAGES.REQUIRED,
                        },
                        pattern: {
                          message: "Please insert correct format",
                          value: REGEX.number,
                        },
                      }}
                      render={({ field: { onBlur, onChange, value } }) => (
                        <>
                          <TextInput
                            label="Quantity:"
                            style={formStyles.input}
                            value={String(value)}
                            onBlur={onBlur}
                            keyboardType="numeric"
                            onChangeText={(value) =>
                              onChange(onlyIntNumber(value))
                            }
                            error={
                              //@ts-ignore
                              errors?.providedServices?.otherServices[
                                serviceIndex
                              ]?.quantity && true
                            }
                          />
                        </>
                      )}
                    />
                    <Controller
                      control={control}
                      defaultValue={""}
                      name={`providedServices.otherServices.${serviceIndex}.notes`}
                      render={({ field: { onBlur, onChange, value } }) => (
                        <>
                          <TextInput
                            label="notes:"
                            style={formStyles.input}
                            value={String(value)}
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(text)}
                          />
                        </>
                      )}
                    />
                    <View
                      style={{
                        ...formStyles.row,
                        marginVertical: 0,
                      }}
                    ></View>
                  </View>
                </>
              }
            </>
          )
        );
      })}
      <Button
        mode="contained"
        onPress={handleSubmit(submitRampChecklist)}
        disabled={!formState.isValid}
      >
        Generate ramp checklist
      </Button>
    </ScrollView>
  );
}
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
