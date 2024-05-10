import dayjs, { Dayjs } from "dayjs";
const isWinterEurDST = (dayjsDate: Dayjs) => {
  const year = dayjsDate.year();

  // Function to find the last Sunday of a given month and year
  const findLastSunday = (year: number, month: number) => {
    const date = dayjs(new Date(year, month + 1, 0)); // Last day of the month
    return date.subtract(date.day(), "day");
  };

  // Find the last Sunday of March
  const lastSundayOfMarch = findLastSunday(year, 2); // March is 2 in 0-indexed month
  // Find the last Sunday of October
  const lastSundayOfOctober = findLastSunday(year, 9); // October is 9 in 0-indexed month

  // Check if current date is outside DST period
  if (
    dayjsDate.isAfter(lastSundayOfMarch) &&
    dayjsDate.isBefore(lastSundayOfOctober.add(1, "day"))
  ) {
    return false; // Time is in Summer DST
  }
  return true; // Time is in Winter (not DST or outside the DST period)
};

export const isSummerNightTime = (dayjsDate: Dayjs) => {
  const hour = dayjsDate.hour();
  return !isWinterEurDST(dayjsDate) && (hour >= 18 || hour < 7);
};

export const isWinterNightTime = (dayjsDate: Dayjs) => {
  const hour = dayjsDate.hour();
  return isWinterEurDST(dayjsDate) && (hour >= 20 || hour < 6);
};
