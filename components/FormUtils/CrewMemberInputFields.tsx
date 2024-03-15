import React from "react";
import { TextInput, Button, HelperText, Text } from "react-native-paper";
import { Flight } from "@/redux/types";
import {
  Controller,
  UseFieldArrayRemove,
  Control,
  FieldErrors,
} from "react-hook-form";
import { DatePickerInput } from "react-native-paper-dates";
import dayjs from "dayjs";
import { StyleProps } from "react-native-reanimated";
import { View } from "react-native";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
const CrewMemberInputFields: React.FC<{
  remove: UseFieldArrayRemove;
  index: number;
  control: Control<Flight, any>;
  errors: FieldErrors<Flight>;
  styles: StyleProps;
}> = ({ control, index, remove, errors, styles }) => {
  return (
    <>
      <View style={styles.row}>
        <Text variant="bodyLarge">Crew {index}</Text>
      </View>
      <Controller
        control={control}
        name={`arrival.crewComposition.${index}.name`}
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label={`Crew ${index} name:`}
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              error={
                errors?.arrival?.crewComposition &&
                errors?.arrival?.crewComposition[index]?.name &&
                true
              }
            />
            <HelperText type="error">
              {errors?.arrival?.crewComposition &&
                errors?.arrival?.crewComposition[index]?.name?.message}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name={`arrival.crewComposition.${index}.nationality`}
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          // pattern: {
          //   message: "Not a valid operator nationality",
          // },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label={`Crew ${index} nationality:`}
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              error={
                errors?.arrival?.crewComposition &&
                errors?.arrival?.crewComposition[index]?.nationality &&
                true
              }
            />
            <HelperText type="error">
              {errors?.arrival?.crewComposition &&
                errors?.arrival?.crewComposition[index]?.nationality?.message}
            </HelperText>
          </>
        )}
      />
      <Controller
        control={control}
        name={`arrival.crewComposition.${index}.idNumber`}
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          // pattern: {
          //   message: "Not a valid operator idNumber",
          // },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label={`Crew ${index} ID/passport number:`}
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              error={
                errors?.arrival?.crewComposition &&
                errors?.arrival?.crewComposition[index]?.idNumber &&
                true
              }
            />
            <HelperText type="error">
              {errors?.arrival?.crewComposition &&
                errors?.arrival?.crewComposition[index]?.idNumber?.message}
            </HelperText>
          </>
        )}
      />
      <Controller
        control={control}
        name={`arrival.crewComposition.${index}.idExpiry`}
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <DatePickerInput
              locale="en-GB"
              label={`Crew ${index} ID expiry date`}
              value={value}
              onChange={(d) => {
                alert(d);
                onChange(d);
              }}
              inputMode="start"
              style={{ width: 200 }}
              mode="outlined"
            />
            <HelperText type="error">
              {errors?.arrival?.crewComposition &&
                errors.arrival?.crewComposition[index]?.idExpiry?.message}
            </HelperText>
          </>
        )}
      />

      <Button
        onPress={() => {
          remove();
        }}
        uppercase={false}
        mode="outlined"
        style={{ flex: 1 }}
      >
        Remove crew member
      </Button>
    </>
  );
};

export default CrewMemberInputFields;
