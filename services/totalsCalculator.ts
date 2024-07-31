import { IFlight } from "@/models/Flight";
import { getVIPLoungeFeePrice } from "./feeCalculator";
import { getVATMultiplier } from "./AirportFeesManager/utils";
import convertCurrency from "@/utils/convertCurrency";
import { getTotalDisbursementAmount } from "./disburseCalculator";
import { getFuelFeeAmount } from "./AirportFeesManager";

const calculateOtherServicesTotal = (existingFlight: IFlight) => {
    let total = 0;

    if (!existingFlight?.providedServices) return 0;

    const {
        otherServices,
    } = existingFlight?.providedServices;

    otherServices?.forEach(
        ({
            isUsed,
            isPriceOverriden,
            totalPriceOverride,
            quantity,
            service: { price, hasVAT },
        }) => {
            if (isUsed) {
                if (isPriceOverriden && totalPriceOverride) {
                    total += hasVAT
                        ? Number(totalPriceOverride) * getVATMultiplier()
                        : Number(totalPriceOverride);
                } else {
                    const servicePriceTotal = (quantity || 0) * price;
                    total += hasVAT
                        ? servicePriceTotal * getVATMultiplier()
                        : servicePriceTotal;
                }
            }
        }
    );

    return Number(total);
};

const calculateSupportServicesTotal = (existingFlight: IFlight) => {
    if (!existingFlight?.providedServices) return 0;

    const {
        supportServices: { HOTAC, airportFee, catering, fuel },
    } = existingFlight?.providedServices;

    const totalFuelPrice = getFuelFeeAmount({
        fuelDensity: fuel.fuelDensity || 0,
        fuelLitersQuantity: fuel.fuelLitersQuantity || 0,
        flight: existingFlight,
    }).toFixed(2);

    const supportServicesTotal = {
        fuel: Number(totalFuelPrice),
        catering: Number(catering.total),
        HOTAC: Number(HOTAC.total),
        airportFee: Number(airportFee?.total),
    };
    return Object.values(supportServicesTotal).reduce((acc, val) => acc + val, 0);
};

const calculateVIPTotalAmount = (existingFlight: IFlight) => {
    if (!existingFlight?.providedServices) return 0;

    const {
        VIPLoungeServices,
    } = existingFlight?.providedServices;

    const { amount: loungeFeeAmount, currency: loungeFeeCurrency } =
        getVIPLoungeFeePrice({
            ...VIPLoungeServices,
        });
    const rateMDLtoEUR = Number(existingFlight?.chargeNote?.currency?.euroToMDL);

    return loungeFeeCurrency === "MDL"
        ? convertCurrency(loungeFeeAmount, rateMDLtoEUR)
        : Number(loungeFeeAmount);
};

const calculateBasicHandlingTotalAmount = (existingFlight: IFlight): number =>
    Number(existingFlight?.providedServices?.basicHandling?.total || 0);

export const calculateTotalAmount = (
    existingFlight: IFlight
): {
    total: number;
} => {
    let total = 0;

    if (existingFlight?.providedServices) {
        total = Number(
            calculateBasicHandlingTotalAmount(existingFlight) +
            calculateOtherServicesTotal(existingFlight) +
            getTotalDisbursementAmount(
                existingFlight?.providedServices,
                existingFlight
            ) +
            calculateSupportServicesTotal(existingFlight)
            + calculateVIPTotalAmount(existingFlight)
        );

    }

    return {
        total,
    };
};
