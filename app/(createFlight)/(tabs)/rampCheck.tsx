import SectionTitle from "@/components/FormUtils/SectionTitle";
import { useProvidedServicesFields } from "@/hooks/useProvidedServicesFields";
import { IFlight } from "@/models/Flight";
import { IProvidedService } from "@/models/ProvidedService";
import { updateFlight } from "@/redux/slices/flightsSlice";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState } from "@/redux/store";
import formStyles from "@/styles/formStyles";
import ArrDepTemplateRenderHTML from "@/utils/arrDepTemplate";
import { errorPrint } from "@/utils/errorPrint";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import { onlyIntNumber } from "@/utils/numericInputFormatter";
import printToFile from "@/utils/printToFile";
import rampChecklistHTML from "@/utils/rampChecklistTemplate";
import reampChecklistHTML from "@/utils/rampChecklistTemplate";
import REGEX from "@/utils/regexp";
import _selectCurrentFlight from "@/utils/selectCurrentFlight";
import { useRealm } from "@realm/react";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
export default function Page() {
  const [loading, setIsLoading] = useState(false);

  const realm = useRealm();

  const currentFlightId = useSelector(
    (state: RootState) => state?.flights.currentFlightId
  );
  const realmExistingFlight = _selectCurrentFlight(currentFlightId || "");
  const existingFlightJSON = realmExistingFlight?.toJSON() as IFlight;
  const submit = (data: Partial<IFlight>) => {
    try {
      realm.write(() => {
        if (realmExistingFlight) {
          realmExistingFlight!
            .providedServices!.otherServices?.filter((_) => _.service)
            .map((service) => {
              data.providedServices?.otherServices
                ?.filter((s) => s?.service?._id)
                .map((s) => {
                  if (
                    service.service.serviceName == s.service?.serviceName &&
                    s.isUsed
                  ) {
                    service.notes = s.notes;
                    service.quantity = Number(s.quantity);
                  }
                });
            });

          realmExistingFlight!.providedServices!.remarks =
            data.providedServices?.remarks;
        }
      });
    } catch (e) {
      errorPrint("Error submitting ramp checklist", e);
    }
  };

  const { control, formState, handleSubmit, getValues, watch } =
    useForm<IFlight>({
      mode: "onBlur",
      defaultValues: {
        providedServices: {
          ...existingFlightJSON.providedServices,
          remarks: existingFlightJSON.providedServices?.remarks ?? "",
        },
      },
    });

  const submitRampChecklist = (data: Partial<IFlight>) => {
    setIsLoading(true);

    submit(data);
    printToFile({
      html: rampChecklistHTML({ ...existingFlightJSON, ...data }),
      fileName: `rampChecklist_${existingFlightJSON?.flightNumber}_${existingFlightJSON?.aircraftRegistration}`,
      width: 585,
      height: 942,
    }).finally(() => setIsLoading(false));
  };

  const { fields, update, remove } = useProvidedServicesFields({
    control,
    existingFlight: existingFlightJSON,
  });
  console.warn("initial fields", JSON.stringify(fields));
  const { errors } = formState;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {(!fields || fields?.filter((f) => f.isUsed).length == 0) && (
        <Text
          style={{ marginVertical: 20, textAlign: "center" }}
          variant="bodyMedium"
        >
          No services selected
        </Text>
      )}
      {fields.map((field, serviceIndex, array) => {
        const { service, isPriceOverriden, isUsed } = field;

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
                    <Text variant="bodyMedium">
                      {service.serviceName}{" "}
                      {isPriceOverriden && "(price overriden)"}
                    </Text>
                    <Controller
                      control={control}
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
                            disabled={isPriceOverriden}
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
      <SectionTitle>Remarks:</SectionTitle>
      <Controller
        control={control}
        defaultValue=""
        name="providedServices.remarks"
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label="Remarks:"
              style={formStyles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              error={errors?.chargeNote?.remarks && true}
              maxLength={100}
            />
            <HelperText type="error">
              {errors?.chargeNote?.remarks?.message}
            </HelperText>
          </>
        )}
      />
      <Button
        mode="contained"
        onPress={handleSubmit(submitRampChecklist)}
        disabled={!formState.isValid || loading}
        loading={loading}
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
