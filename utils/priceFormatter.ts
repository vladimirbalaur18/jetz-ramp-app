import convertCurrency from "./convertCurrency";
import { store } from "@/redux/store";
export default function formatMDLPriceToEuro(price: {
  amount: number;
  currency: string;
  euroToMDL: number;
}) {
  const rateMDLtoEUR = price.euroToMDL;
  if (price.currency === "EUR") {
    return { displayedString: price.amount + " EUR", amountEuro: price.amount };
  }

  return {
    displayedString: `${price.amount} MDL (${convertCurrency(
      price.amount,
      rateMDLtoEUR
    ).toFixed(2)} EUR)`,
    amountEuro: convertCurrency(price.amount, rateMDLtoEUR),
  };
}
