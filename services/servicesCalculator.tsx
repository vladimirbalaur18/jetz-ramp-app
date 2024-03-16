import { Flight } from "@/redux/types";
import basicHandlingFees from "@/configs/basicHandlingFees.json";
import serviceDefinitions from "@/configs/serviceDefinitions.json";
import AirportFees from "@/configs/airportFees.json";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";

dayjs.extend(isBetween);
dayjs.extend(utc);

export const getBasicHandlingPrice = (flight: Flight) => {
  for (let { minMTOW, maxMTOW, pricePerQty } of basicHandlingFees) {
    if (flight.mtow >= minMTOW && flight.mtow <= maxMTOW) {
      return pricePerQty;
    }
  }
};

export const getAirportFeePrice = (flight: Flight) => {
  let result = {
    landing: 0,
    takeOff: 0,
    passengers: 0,
    security: 0,
    parking: 0,
  };

  const totalArrivalPassengerCount =
    Number(flight.arrival.adultCount) + Number(flight.arrival.minorCount);
  const totalDepartingPassengerCount =
    Number(flight.departure.adultCount) + Number(flight.departure.minorCount);
  const arrivalTime = dayjs(flight.arrival.arrivalDate)
    .set("hour", flight.arrival?.arrivalTime.hours)
    .set("minutes", flight.arrival?.arrivalTime.minutes);

  const departureTime = dayjs(flight.departure.departureDate)
    .set("hour", flight.departure?.departureTime.hours)
    .set("minutes", flight.departure?.departureTime.minutes);
  const flightMTOWinTons = Number(flight.mtow) / 1000;
  const isLightAircraft = flight.mtow < 2000;
  const hoursBetweenArrDep = departureTime.diff(arrivalTime, "hours");
  const daysBetweenArrDep = departureTime.diff(arrivalTime, "days") || 1;

  const isNightTime = (dayjsDate: Dayjs) => {
    const isWinterEurDST = (dayjsDate: Dayjs) => {
      // Get the year from the dayjs date
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
    const hour = dayjsDate.hour();

    return isWinterEurDST(dayjsDate)
      ? hour >= 18 || hour < 7
      : hour >= 20 || hour < 6;
  };

  if (flight.isCommercialFlight) {
    result.landing =
      flightMTOWinTons * AirportFees.commercial.landingFee.perTon;

    console.log("mto", flightMTOWinTons);
    result.takeOff =
      flightMTOWinTons * AirportFees.commercial.takeoffFee.perTon;

    result.passengers =
      AirportFees.commercial.passengerFee.perPax *
      (totalArrivalPassengerCount + totalDepartingPassengerCount);

    result.security =
      totalDepartingPassengerCount > 0
        ? AirportFees.commercial.securityFee.perPax *
          totalDepartingPassengerCount
        : AirportFees.commercial.securityFee.perTon * flightMTOWinTons;

    result.parking =
      hoursBetweenArrDep <= 4 //first 4 hours of parking are free
        ? 0
        : daysBetweenArrDep *
          flightMTOWinTons *
          AirportFees.commercial.parkingDay.perTon;
  } else {
    result.landing = isLightAircraft
      ? flightMTOWinTons * AirportFees.nonCommercial.landingFee.lightAircraft
      : flightMTOWinTons *
        AirportFees.nonCommercial.landingFee.perTon *
        (isNightTime(arrivalTime) ? 1.2 : 1);

    result.takeOff = isLightAircraft
      ? flightMTOWinTons * AirportFees.nonCommercial.takeoffFee.lightAircraft
      : flightMTOWinTons *
        AirportFees.nonCommercial.takeoffFee.perTon *
        (isNightTime(departureTime) ? 1.2 : 1);

    result.passengers =
      AirportFees.nonCommercial.passengerFee.perPax *
      (totalArrivalPassengerCount + totalDepartingPassengerCount);

    result.security =
      totalDepartingPassengerCount > 0
        ? AirportFees.nonCommercial.securityFee.perPax *
          totalDepartingPassengerCount
        : AirportFees.nonCommercial.securityFee.perTon * flightMTOWinTons;

    result.parking =
      hoursBetweenArrDep <= 4 //first 4 hours of parking are free
        ? 0
        : daysBetweenArrDep *
          flightMTOWinTons *
          AirportFees.commercial.parkingDay.perTon;
  }

  alert(JSON.stringify(result));

  return Object.values(result).reduce((sum, value) => sum + value, 0);
};

export const getAllServices = () => serviceDefinitions;
