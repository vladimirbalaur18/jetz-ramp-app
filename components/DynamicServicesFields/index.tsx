import { View } from "react-native";
import { Text, TextInput, Switch } from "react-native-paper";
import React, { useEffect } from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  FormState,
  useFieldArray,
} from "react-hook-form";
import REGEX from "@/utils/regexp";
import ERROR_MESSAGES from "@/utils/formErrorMessages";

import { Flight } from "@/redux/types";
import SectionTitle from "../FormUtils/SectionTitle";
import formStyles from "@/styles/formStyles";
import { getAllServices } from "@/services/servicesCalculator";

const DynamicServicesFields: React.FC<{
  name?: "providedServices.otherServices";
  control: Control<Flight> | undefined;
  formState: FormState<Flight>;
}> = ({ name = "providedServices.otherServices", control, formState }) => {
  const SERVICES_DEFINITIONS = getAllServices();

  const { errors } = formState;
  const { fields, append, update } = useFieldArray({
    control,
    name,
  });

  useEffect(() => {
    //render additional services inputs

    //prevent from appending too many fields
    const areThereFieldsLeftToRender =
      fields?.length < SERVICES_DEFINITIONS.length;
    alert("running appending effect");

    areThereFieldsLeftToRender &&
      SERVICES_DEFINITIONS?.forEach(({ serviceCategoryName, services }) => {
        append({
          serviceCategoryName: serviceCategoryName,
          services: services.map(({ serviceName, pricingRules }) => {
            return {
              serviceName: serviceName,
              pricingRules: pricingRules,
              isUsed: false,
              quantity: 1,
              notes: "",
            };
          }),
        });
      });
  }, [append, SERVICES_DEFINITIONS]);

  return (
    <View>
      {fields?.map((category, categoryIndex) => {
        return (
          <>
            <SectionTitle>{category?.serviceCategoryName}</SectionTitle>
            {category?.services?.map((service, serviceIndex) => {
              const { isUsed, notes, quantity, serviceName } = service;
              return (
                <>
                  <View style={{ ...formStyles.row, marginVertical: 10 }}>
                    <Text variant="bodyLarge">{serviceName}</Text>
                    <Controller
                      control={control}
                      defaultValue={isUsed}
                      name={`providedServices.otherServices.${categoryIndex}.services.${serviceIndex}.isUsed`}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <Switch
                            value={value}
                            onValueChange={(value) => {
                              //if there is at least oen erroneous field, dont' allow selecting dynamic fields
                              //this causees race conditions
                              console.log(errors);
                              if (
                                Object.entries(errors).some(([key, value]) => {
                                  if (value) {
                                    alert(
                                      "Please complete the erroneous fields first"
                                    );
                                    return value;
                                  }
                                })
                              )
                                return;

                              update(categoryIndex, {
                                ...category,
                                services: (category?.services).map(
                                  (service, i) =>
                                    i === serviceIndex
                                      ? { ...service, isUsed: value }
                                      : service
                                ),
                              });
                              onChange(value);
                            }}
                          />
                        </>
                      )}
                    />
                  </View>
                  <View>
                    {isUsed === true && (
                      <>
                        <Controller
                          control={control}
                          defaultValue={1}
                          name={`providedServices.otherServices.${categoryIndex}.services.${serviceIndex}.quantity`}
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
                                onChangeText={(text) => onChange(text)}
                                error={
                                  //@ts-ignore
                                  errors?.providedServices?.otherServices[
                                    categoryIndex
                                  ]?.services[serviceIndex]?.quantity && true
                                }
                              />
                            </>
                          )}
                        />
                        <Controller
                          control={control}
                          defaultValue={""}
                          name={`providedServices.otherServices.${categoryIndex}.services.${serviceIndex}.notes`}
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
                      </>
                    )}
                  </View>
                </>
              );
            })}
          </>
        );
      })}
    </View>
  );
};

export default DynamicServicesFields;
