import { GeneralConfigState } from "@/models/Config";
import { realmWithoutSync } from "@/realm";
import { getFuelFeeAmount } from "@/services/AirportFeesManager";
import { getVATMultiplier } from "@/services/AirportFeesManager/utils";
import {
  getBasicHandlingPrice,
  getLoungeFeePrice,
  getTotalAirportFeesPrice,
} from "@/services/servicesCalculator";
import dayjs from "dayjs";
import convertCurrency from "./convertCurrency";
import getParsedDateTime from "./getParsedDateTime";
import { IFlight } from "@/models/Flight";

type ChargeListService = {
  serviceName: string;
  basePrice: number;
  totalPrice?: number;
  isPriceOverriden?: boolean;
  quantity?: number;
};
export default function chargeNoteTemplateHTML(flight: IFlight) {
  if (!flight) throw new Error("Flight is undefined");
  let VATServicesList: Array<ChargeListService> = [];
  let servicesListNoVAT: Array<ChargeListService> = [];

  const [config] = realmWithoutSync.objects<GeneralConfigState>("General");
  console.log("confa", config);
  const basicHandling = getBasicHandlingPrice(flight);

  const basicHandlingWithoutVAT = (() => {
    let result = 0;

    if (flight?.providedServices?.basicHandling?.isPriceOverriden)
      return Number(flight?.providedServices?.basicHandling?.total);

    if (!basicHandling.vat.arrival) {
      result += basicHandling.arrival;
    }

    if (!basicHandling.vat.departure) {
      result += basicHandling.departure;
    }

    return result;
  })();
  const basicHandlingWithVAT = (() => {
    if (flight?.providedServices?.basicHandling?.isPriceOverriden)
      return Number(flight?.providedServices?.basicHandling?.total);

    let result = 0;
    if (basicHandling.vat.arrival) {
      result += basicHandling.arrival;
    }

    if (basicHandling.vat.departure) {
      result += basicHandling.departure;
    }

    return result;
  })();
  const totalDisbursementFeesAmount = Object.values(
    flight?.providedServices!.disbursementFees
  ).reduce(
    (accumulator, current) => Number(accumulator) + Number(current || 0),
    0
  );

  if (
    basicHandlingWithVAT &&
    !flight?.providedServices!.basicHandling?.isPriceOverriden
  ) {
    VATServicesList.push({
      serviceName: "Basic handling",
      basePrice: Number(basicHandlingWithVAT) / getVATMultiplier(),
      totalPrice: Number(basicHandlingWithVAT),
      quantity: 1,
    });
  }

  if (basicHandlingWithoutVAT) {
    servicesListNoVAT.push({
      serviceName: "Basic handling",
      basePrice: Number(basicHandlingWithoutVAT),
      totalPrice: Number(basicHandlingWithoutVAT),
      quantity: 1,
    });
  }

  flight?.providedServices?.otherServices?.forEach((s) => {
    if (s?.isUsed) {
      const quantity = Number(s?.quantity) || 0;
      const basePrice = s?.service.price;
      const amount = s?.isPriceOverriden
        ? s.totalPriceOverride || 0
        : basePrice || 0;

      if (!s.service.hasVAT) {
        servicesListNoVAT.push({
          serviceName: s.service.serviceName,
          basePrice: Number(amount),
          totalPrice: Number(amount * quantity),
          quantity: Number(quantity),
        });
      } else
        VATServicesList.push({
          serviceName: s.service.serviceName,
          basePrice: Number(amount),
          totalPrice: Number(amount * quantity) * getVATMultiplier(),
          quantity: Number(quantity),
        });
    }
  });

    const disbursementPercentage =
    flight.chargeNote.disbursementPercentage;

  const VIPTerminalPrice = getLoungeFeePrice({
    ...flight?.providedServices?.VIPLoungeServices,
  }).amount;
  const VIPPriceToEur = Number(
    convertCurrency(
      VIPTerminalPrice,
      Number(Number(flight?.chargeNote?.currency?.euroToMDL))
    )
  );
  const airportFeeTotal = Number(
    flight?.providedServices?.supportServices?.airportFee.total
  );
  const cateringFeeTotal = Number(
    flight?.providedServices?.supportServices?.catering.total
  );
  const fuelFeeTotal = getFuelFeeAmount({
    ...flight?.providedServices?.supportServices?.fuel,
    flight,
  });
  const hotacFeeTotal = Number(
    flight?.providedServices?.supportServices.HOTAC.total
  );

  const totalSupportServicesAmount =
    VIPPriceToEur + cateringFeeTotal + fuelFeeTotal + hotacFeeTotal;

  const additionalServicesRenderHTML = () => {
    let resultHTML = "";

    servicesListNoVAT.map((s) => {
      resultHTML += `
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl118" style="height:14.4pt;">&nbsp;</td>
  <td colspan="4" class="xl134" style="border-right:.5pt solid black">${
    s?.serviceName
  }</td>
  <td class="xl121" style=";border-left:none">${s?.quantity}</td>
  <td colspan="2" class="xl114" style="border-right:.5pt solid black">${
    s?.isPriceOverriden
      ? Number(s?.totalPrice).toFixed(2)
      : s?.basePrice?.toFixed(2)
  }</td>
  <td colspan="2" class="xl114" style="border-right:1.0pt solid black">${Number(
    s?.totalPrice
  ).toFixed(2)}</td>
 </tr>`;
    });

    return resultHTML;
  };
  const thirdPartyServiceProvidersRenderHTML = () => {
    return `<tr height="19" style="height:14.4pt">
  <td height="19" class="xl139" style="height:14.4pt">&nbsp;</td>
  <td class="xl140" colspan="2" style="mso-ignore:colspan">Express/VIP Terminal</td>
  <td class="xl140" style="border-top:none">&nbsp;</td>
  <td class="xl141" style="border-top:none">&nbsp;</td>
  <td class="xl92" style="border-top:none;border-left:none">&nbsp;</td>
  <td class="xl114" style="border-top:none">&nbsp;</td>
  <td class="xl115" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl114" style="border-right:1.0pt solid black">${
    VIPPriceToEur.toFixed(2) || 0
  }</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl142" style="height:14.4pt">&nbsp;</td>
  <td class="xl134" colspan="2" style="mso-ignore:colspan">Airport fees</td>
  <td class="xl134">&nbsp;</td>
  <td class="xl128">&nbsp;</td>
  <td class="xl143" style="border-top:none;border-left:none">&nbsp;</td>
  <td class="xl114" style="border-top:none">&nbsp;</td>
  <td class="xl115" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl144" style="border-right:1.0pt solid black">${
    airportFeeTotal.toFixed(2) || 0
  }</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl142" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td class="xl134" style="border-top:none">Catering</td>
  <td class="xl134" style="border-top:none">&nbsp;</td>
  <td class="xl134" style="border-top:none">&nbsp;</td>
  <td class="xl128" style="border-top:none">&nbsp;</td>
  <td class="xl146" style="border-top:none">&nbsp;</td>
  <td class="xl114" style="border-top:none">&nbsp;</td>
  <td class="xl115" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl144" style="border-right:1.0pt solid black">${
    cateringFeeTotal.toFixed(2) || 0
  }</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl142" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td class="xl134" style="border-top:none">Fuel</td>
  <td class="xl134" style="border-top:none">&nbsp;</td>
  <td class="xl134" style="border-top:none">&nbsp;</td>
  <td class="xl128" style="border-top:none">&nbsp;</td>
  <td class="xl147" style="border-top:none">&nbsp;</td>
  <td class="xl114" style="border-top:none">&nbsp;</td>
  <td class="xl115" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl148" width="128" style="border-right:1.0pt solid black;
  width:96pt">${fuelFeeTotal.toFixed(2)}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl150" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td class="xl140" style="border-top:none">HOTAC</td>
  <td class="xl140" style="border-top:none">&nbsp;</td>
  <td class="xl140" style="border-top:none">&nbsp;</td>
  <td class="xl128" style="border-top:none">&nbsp;</td>
  <td class="xl151" style="border-top:none">&nbsp;</td>
  <td class="xl114" style="border-top:none">&nbsp;</td>
  <td class="xl115" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl144" style="border-right:1.0pt solid black">${
    hotacFeeTotal.toFixed(2) || 0
  }</td>
 </tr>`;
  };
  const VATApplicableServicesRenderHTML = () => {
    return VATServicesList.map(
      ({ basePrice, serviceName, totalPrice, isPriceOverriden }) => {
        return ` <tr height="20" style="height:15.0pt">
  <td height="20" class="xl127" style="height:15.0pt;border-top:none">&nbsp;</td>
  <td colspan="2" class="xl134">${serviceName}</td>
  <td class="xl163" style="border-top:none">&nbsp;</td>
  <td class="xl163" style="border-top:none">&nbsp;</td>
  <td class="xl161" style="border-top:none">&nbsp;</td>
  <td class="xl115" style="border-top:none">${basePrice.toFixed(2)}</td>
  <td class="xl181" style="border-top:none">${config.VAT}%</td>
  <td colspan="2" class="xl182" style="border-right:1.0pt solid black">${totalPrice}</td>
 </tr>`;
      }
    );
  };

  const servicesTotalAmountNoVAT =
    servicesListNoVAT.reduce(
      (accumulator, current) => accumulator + (current?.totalPrice || 0),
      0
    ) +
    getTotalAirportFeesPrice(flight).total +
    totalDisbursementFeesAmount +
    totalSupportServicesAmount;

  console.log(
    "ok",
    servicesListNoVAT.reduce(
      (accumulator, current) => accumulator + (current?.totalPrice || 0),
      0
    ),
    getTotalAirportFeesPrice(flight).total,
    totalDisbursementFeesAmount,
    totalSupportServicesAmount
  );

  const servicesTotalAmountWithVAT = VATServicesList.reduce(
    (accumulator, current) => accumulator + (current?.totalPrice || 0),
    0
  );

  return `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta name="ProgId" content="Excel.Sheet">
<meta name="Generator" content="Microsoft Excel 15">
<link rel="Stylesheet" href="stylesheet.css">
<style>
<!--table
	{mso-displayed-decimal-separator:"\.";
	mso-displayed-thousand-separator:"\,";}
@page
	{margin:.03in .7in .75in .7in;
	mso-header-margin:0;
	mso-footer-margin:0;}
-->

tr
	{mso-height-source:auto;}
col
	{mso-width-source:auto;}
br
	{mso-data-placement:same-cell;}
.style62
	{color:#0563C1;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:underline;
	text-underline-style:single;
	font-family:Calibri, sans-serif;
	mso-font-charset:0;
	mso-style-name:Hyperlink;
	mso-style-id:8;}
a:link
	{color:#0563C1;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:underline;
	text-underline-style:single;
	font-family:Calibri, sans-serif;
	mso-font-charset:0;}
a:visited
	{color:#954F72;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:underline;
	text-underline-style:single;
	font-family:Calibri, sans-serif;
	mso-font-charset:0;}
.style0
	{mso-number-format:General;
	text-align:general;
	vertical-align:bottom;
	white-space:nowrap;
	mso-rotate:0;
	mso-background-source:auto;
	mso-pattern:auto;
	color:black;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:none;
	font-family:Calibri, sans-serif;
	mso-font-charset:0;
	border:none;
	mso-protection:locked visible;
	mso-style-name:Normal;
	mso-style-id:0;}
td
	{mso-style-parent:style0;
	padding:0px;
	mso-ignore:padding;
	color:black;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:none;
	font-family:Calibri, sans-serif;
	mso-font-charset:0;
	mso-number-format:General;
	text-align:general;
	vertical-align:bottom;
	border:none;
	mso-background-source:auto;
	mso-pattern:auto;
	mso-protection:locked visible;
	white-space:nowrap;
	mso-rotate:0;}
.xl65
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;}
.xl66
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;}
.xl67
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl68
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;}
.xl69
	{mso-style-parent:style0;
	font-size:16.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;}
.xl70
	{mso-style-parent:style62;
	color:#0563C1;
	font-size:10.0pt;
	text-decoration:underline;
	text-underline-style:single;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;}
.xl71
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	vertical-align:middle;}
.xl72
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:"\[ENG\]\[$-409\]dd\/mmm\/yy\;\@";
	text-align:center;
	vertical-align:middle;}
.xl73
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:"Short Date";
	text-align:center;
	vertical-align:middle;}
.xl74
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;}
.xl75
	{mso-style-parent:style0;
	color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl76
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl77
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl78
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl79
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl80
	{mso-style-parent:style0;
	color:#31394D;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl81
	{mso-style-parent:style0;
	color:#31394D;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl82
	{mso-style-parent:style0;
	color:#31394D;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl83
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl84
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border:.5pt solid windowtext;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl85
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl86
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl87
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl88
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl89
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl90
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl91
	{mso-style-parent:style0;
	color:#31394D;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl92
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border:.5pt solid windowtext;}
.xl93
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:"Medium Date";
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl94
	{mso-style-parent:style0;
	color:#31394D;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:"Medium Date";
	text-align:right;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl95
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl96
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl97
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl98
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl99
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:none;
	border-left:.5pt solid windowtext;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl100
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl101
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;}
.xl102
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:"Short Time";
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:.5pt solid windowtext;}
.xl103
	{mso-style-parent:style0;
	color:#31394D;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:"Short Time";
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:.5pt solid windowtext;}
.xl104
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl105
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl106
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl107
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl108
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl109
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl110
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl111
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:none;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl112
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:none;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl113
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl114
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl115
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl116
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;}
.xl117
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl118
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl119
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;}
.xl120
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl121
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:none;
	border-left:.5pt solid windowtext;}
.xl122
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border:.5pt solid windowtext;}
.xl123
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl124
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl125
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl126
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl127
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl128
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl129
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border:.5pt solid windowtext;}
.xl130
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl131
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl132
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border:.5pt solid windowtext;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl133
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;
	white-space:nowrap;
	mso-text-control:shrinktofit;}
.xl134
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl135
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl136
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl137
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl138
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl139
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl140
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;}
.xl141
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl142
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl143
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border:.5pt solid windowtext;}
.xl144
	{mso-style-parent:style0;
	color:windowtext;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl145
	{mso-style-parent:style0;
	color:windowtext;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl146
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl147
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl148
	{mso-style-parent:style0;
	color:windowtext;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;
	white-space:normal;}
.xl149
	{mso-style-parent:style0;
	color:windowtext;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;
	white-space:normal;}
.xl150
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl151
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl152
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:none;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl153
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl154
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl155
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:0%;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl156
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl157
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:0%;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl158
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl159
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl160
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;}
.xl161
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl162
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:.5pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl163
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl164
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl165
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl166
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl167
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl168
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl169
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl170
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl171
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:.5pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl172
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:.5pt solid windowtext;
	background:#D9D9D9;
	mso-pattern:black none;}
.xl173
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	background:#D9D9D9;
	mso-pattern:black none;}
.xl174
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	background:#D9D9D9;
	mso-pattern:black none;}
.xl175
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	background:#D9D9D9;
	mso-pattern:black none;}
.xl176
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl177
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl178
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl179
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl180
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl181
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Percent;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl182
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl183
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl184
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl185
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl186
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl187
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl188
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl189
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;}
.xl190
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl191
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl192
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl193
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl194
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl195
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;
	background:#D9D9D9;
	mso-pattern:black none;
	mso-protection:unlocked visible;}
.xl196
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	background:#D9D9D9;
	mso-pattern:black none;
	mso-protection:unlocked visible;}
.xl197
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:.5pt solid windowtext;
	background:#D9D9D9;
	mso-pattern:black none;
	mso-protection:unlocked visible;}
.xl198
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	background:#D9D9D9;
	mso-pattern:black none;
	mso-protection:unlocked visible;}
.xl199
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl200
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;
	mso-protection:unlocked visible;}
.xl201
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	mso-protection:unlocked visible;}
.xl202
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	mso-protection:unlocked visible;}
.xl203
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	mso-protection:unlocked visible;}
.xl204
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl205
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl206
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl207
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;}
.xl208
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl209
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:"Medium Date";
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl210
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl211
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl212
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl213
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl214
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl215
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:Fixed;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl216
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl217
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl218
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-style:italic;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;
	mso-protection:unlocked visible;}
.xl219
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;
	mso-protection:unlocked visible;}
.xl220
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;
	mso-protection:unlocked visible;}
.xl221
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	mso-protection:unlocked visible;}
.xl222
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;
	mso-protection:unlocked visible;}
.xl223
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	mso-protection:unlocked visible;}
.xl224
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	mso-protection:unlocked visible;}
.xl225
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;}
.xl226
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl227
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl228
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl229
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl230
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl231
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl232
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl233
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Opens sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}

</style>

</head>

<body link="#0563C1" vlink="#954F72">

<table border="0" cellpadding="0" cellspacing="0" width="640" style="border-collapse:
 collapse;table-layout:fixed;width:550pt">
 <colgroup><col width="64" span="10" style="width:48pt">
 </colgroup><tbody><tr height="19" style="height:14.4pt">
  <td height="19" width="64" style="height:14.4pt;width:48pt" align="left" valign="top">
 <span style="mso-ignore:vglayout;
  position:absolute;z-index:1;margin-left:2px;margin-top:0px;width:656px;
  height:50px">
  <img width="656" height="50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACGsAAADrCAMAAADjEnmjAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURQAAANfDr9fDr9rEsjE5TVtcZoR+fq+hmNnEsbUEaTkAAAAEdFJOUwBAgL+jVN0MAAAACXBIWXMAADLAAAAywAEoZFrbAAAJaElEQVR4Xu3b2XbTWBAF0AAN9P9/cRM4OEPLiWXfku6w9xtPOBqqzjqSnv4BAGjv+/cfP37+/PmvrAEAtPP9T8T494WsAQA8KgnjdcS4kDUAgDs9R4wrCeOFrAEA7PJRibFB1gAAbnFTibFB1gAArttZYmyQNQCA/7m3xNggawAA8XiJsUHWAIDVNSwxXvn27evXL1++PMkaALCmkhLjV8L4HTGeXsn/BwAsoaTESMJ4EzEu8h8DABOrKzGuJYwX+QkAwHwqH5N8FjEu8lsAgFmkxEg0aOW2EmNDfhUAMLguSowN+XkAwJCqPli9s8TYkB8KAAyk9IPVNhHjIj8ZAOhf/yXGhvx2AKBXI5UYG/JXAACdGbLE2JA/BwDoQmmJke1/rPxhAMCZqkqMYx6TfCh/IQBwvPlKjA35WwGAw5SUGIe967lX/mgAoFhdidFjwniRPx8AqFH5mKTniHGR4wAAtJQSI9Gglf5LjA05IgBAA8uXGBtyaACAuykxPpKDBADsVPrB6vgR4yKHCwC4TckHq9OUGBty3ACAjygx7pYjCABsUGI8LocSALhQYrSUgwoAVJUYSyaMFzm6ALCq0hIj63ZpOc4AsBglxlFywAFgCUqM4+XQA8DMSkqMVd/13CvnAADmU1diSBg75GwAwDQqH5OIGPvltADA4FJiJBq0osR4XE4QAIxJidG9nCkAGEnVB6tKjAI5ZwDQv9IPVkWMKjl7ANAtJcbYchoBoDNKjFnkhAJAH5QY08mZBYAzlZYYWXmcJOcYAE5QVWJ4TNKTnGwAOIwSYy057QBQraTE8K5n/3L+AaBGXYkhYQwiVwIANFX5mETEGEsuCQBoICVGokErSoyx5eIAgPspMfhArhIA2EuJwU1yvQDAbUo/WBUxZpQrBwA+VPLBqhJjCbmEAGCDEoPH5WICgBdKDBrKVQUASgxK5PoCYFlVJYaEwR+50ABYTGmJkR0Dz3LJAbAGJQaHy7UHwMyUGJwoVyEAEyopMbzryU65HAGYRl2JIWFwj1yYAIyu8jGJiMEDcoUCMKaUGIkGrSgxaCjXKgBDUWIwjly0AAyg6oNVJQaVcvkC0K3SD1ZFDMrlQgagN0oMJpErGoA+KDGYTq5tAE6lxGBeucgBOIESgxXkcgfgOFUlhoRBl3LdA1CttMTIUIcO5Q4AoIgSg9XlVgCgqboSQ8JgNLkpAGihpMTwridjy90BwP1SYiQatKLEYBK5TwDYrfJdTxGDeeSGAeBGSgzYJ7cOAB+qe9dTxGB2uYkA2FLyrqcSg7XkbgLghRIDGsp9BYASA0rkBgNYlhIDauVWA1hNVYkhYcA7uecA1lBaYmSwAm/k7gOYmhIDzpPbEGBCSgzoQW5IgHmUlBje9YR75c4EGF1diSFhwENyjwIMqvIxiYgBLeRmBRhKSoxEg1aUGFAhty3ACJQYMKDcvwD9UmLA0HInA/Sm9INVEQOOk3saoBMlH6wqMeBEubkBTqXEgHnlNgc4gxIDFpD7HeA4SgxYSu58gHJVJYaEAX3LCAAoUlpiZJIBPcswAGhLiQFEpgJAC3UlhoQBw8p8AHhASYnhXU+YRAYFwG5KDOAWGRkAt6p811PEgAlldgB8LCVGokErSgxYQKYIwJa6xyQiBiwj8wTglZJ3PZUYsKgMFgAlBlAiIwZYlxIDKJVZA6xGiQEcJFMHWIQSAzhaxg8wtdISI9MEYFsGETCjqhLDYxJgh0wkYB5KDKArmU3A8EpKDO96Ag/LkAIGVVdiSBhAGxlXwFgqH5OIGEBTmVvACFJiJBq0osQASmWCAR1TYgAjyygDuqPEAOaQoQZ0ovSDVREDOEHGG3Cukg9WlRhADzLngDMoMYAFZOIBB1JiACvJ6APKKTGANWUIAlWqSgwJAxhEpiHQVmmJkdsXYAiZi0ATSgyA9zIggQcoMQCuy6gE9ispMbzrCcwmMxO4VV2JIWEAU8r0BD5R+ZhExABmljEKbEqJkWjQihIDWEkGKvBK6bueIgawmIxWoOhdTyUGsLrMWFiXEgOgVKYtLEeJAXCMjF1YhBID4GgZwDA3JQbAaTKJYUZKDIAOZCbDRKpKDAkD4B4ZzjC80hIj9wsA+2VMw6hKSgyPSQDaybyGsdSVGBIGQGOZ3DAE73oCjCcjHDqWEiPRoBUlBsAxMsyhP0oMgClkqkMvlBgAk8l8h3OVfrAqYgCcKZMeTlHywaoSA6ArGflwICUGwEoy/KGeEgNgSdkCUEWJAbC47ANorKrEkDAARpPFAE2Ulhi5ZgEYS1YEPEKJAcBV2RWwnxIDgBtka8DNSkoM73oCTCvrAz5RV2JIGABzyyKBbZWPSUQMgCVko8BrKTESDVpRYgAsKbsFflFiANBelgwLq/pgVYkBwLOsG5ZT+sGqiAHARRYPq1BiAHCwbCDmpsQA4DTZRUxJiQHA+bKUmIgSA4CeZD0xvqoSQ8IA4CHZU4yqtMTIRQIAD8jGYjBKDABGkdXFEOpKDAkDgCpZYvSspMTwricAx8g2oz8pMRINWlFiAHCw7DW6Ufmup4gBwPGy4DiZEgOAWWXVcYq6dz1FDAB6kaXHkUre9VRiANCnbD/qKTEAWFL2IGWUGACsLQuRxpQYAPBHViNtKDEA4J3sSB5RWmLkRAHAoLItuUNVieExCQAzydrkZkoMANgjC5TPlJQY3vUEYH7ZpGyrKzEkDAAWkZ3KG5WPSUQMANaS5covKTESDVpRYgCwtqzZlSkxAKBQ9u16lBgAcIhs3lWUfrAqYgDA/2UHT67kg1UlBgDcIMt4SkoMADhf1vJMlBgA0JHs5/EpMQCgS9nUw6oqMSQMAGgjK3swpSVGjgwA0EKW9xiUGAAwnGzxnikxAGBg2ecdKikxvOsJAAfLYu9GSoxEg1Z8sAoAZ8mKP1vlYxIRAwBOlF1/DiUGAEwvW/9Ipe96ihgA0Jfs/wOUvOupxACAziUIlFFiAMDaEglaU2IAAL8lG7ShxAAA3klKeIgSAwC4JnHhDqUlRn4dADC6BIfbVZUYHpMAwJSSID6jxAAA7pIscUVJieFdTwBYSELFG3UlhoQBAKtJvHhW+ZhExACARf0tMRINWlFiAAC/fUs4aEKJAQC80yJrKDEAgGsSF+6gxAAAPpfgcDslBgCwQxLEZ5QYAMBdkiWuUGIAAI9JqHhDiQEAtJJ48UzCAACa+1ti5J8AAO08Pf0HkhIu187P8rQAAAAASUVORK5CYII=" v:shapes="Shape_x0020_2 Shape_x0020_3 Shape_x0020_4 Shape_x0020_5 Shape_x0020_6 Shape_x0020_7 Shape_x0020_8 Shape_x0020_9 Shape_x0020_10 Shape_x0020_11 Shape_x0020_12 Picture_x0020_12"></span><!--[endif]--><span style="mso-ignore:vglayout2">
  <span style="mso-ignore:vglayout;
  position:absolute;z-index:1;margin-left:4e90px; margin-top:15px">
  <img 
height="100" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWQAAADVCAMAAABXJHp2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURf///+7u7tPT0729vcTExOnp6ezs7MLCwsHBwbq6unp6eisrKwAAAAEBAW1tbe/v787OznFxcXx8fPT09Nra2sfHxw0NDYuLi/n5+crKyjAwMJ+fn/7+/vX19c3NzWxsbLGxsfDw8M/Pz46Ojru7u/z8/NLS0tXV1SYmJvLy8tTU1FNTU+jo6NjY2MnJyQkJCSIiIvr6+hEREUZGRuvr69vb22traxwcHCQkJPHx8fb29lJSUt3d3WlpaRgYGODg4F9fX4qKihMTEx8fH8vLyxkZGePj4wcHB7W1tXd3d+fn5+Xl5QoKChoaGmVlZeLi4hQUFIWFhaqqqgQEBAMDAxYWFhcXF+rq6lpaWhUVFdbW1qmpqW5ubgwMDCkpKdnZ2f39/ZGRkRAQEK6ursDAwNDQ0AICAg8PD9zc3AUFBczMzPPz80BAQNfX1wsLC3V1dcXFxfv7+15eXra2trm5uff39/j4+HJycnBwcAYGBoODg7i4uCMjI62trUlJSd/f34mJiWJiYn19faKioubm5pOTk5aWlk1NTXZ2dpycnN7e3ldXV2hoaH9/f4SEhGdnZ9HR0VtbW4aGhnt7e5CQkFRUVK+vrz4+PoGBgaWlpbS0tJiYmFBQUI2NjVxcXEpKSiwsLKCgoIeHh2FhYZqamu3t7cbGxjs7O+Tk5GpqakRERJKSkmNjY4iIiLe3tyUlJU5OTuHh4UdHRzw8PBsbGx0dHR4eHkVFRUNDQ7CwsG9vbzIyMpWVlXR0dIKCgp2dnaGhoaSkpKOjo6ampqenp56enqioqL+/v2ZmZggICDo6OlFRUYCAgHl5eWRkZL6+vg4ODjc3NyoqKkJCQn5+fjU1NS8vLy4uLoyMjDExMZubm3h4eF1dXT8/P1VVVZeXl7Ozs0tLS0xMTLKyslZWVry8vD09PSgoKMjIyDk5OUFBQS0tLRISEiEhITMzMycnJzY2NpmZmTg4OI+Pj8PDw0hISKurqzQ0NJSUlGBgYCAgIHNzc09PT6ysrFlZWQAAANQqSogAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAACHVAAAh1QEEnLSdAAAMZUlEQVR4Xu2d25GrOBCGzbvDIAAXzyTA64RBaK4iD6JwCFSRwfYvNXc11gWM16e/3TkzIEDST9MSQpeboiiKoiiKoiiKoiiKoiiKoiiKoijKd5KVeV5nvKEcTVbndZ5Xj/v93uJPVfpgSNS6JXXnVDkHKumUdV2zriuamg9REshI3xr+QaJXmdMgfdcewsEfH62EAgtuWMV3qGeOoKzLumIBvfjBWgZJUJ6WrZIuztJ58/g5kcsc+XqekK+sJIWNamE8+PwfgnN2sMoQ2KOMc1D8nh0TnLkDVY4W+FclvmWcvfvriOyRvqVvJWJL8fjRSnJWcA7vLe+JpcyiXPBI8fjduttoyvcq3pZJ4Ok6URSp9/irKUdTvje8K4iM9P3jC0RSFEVU1P8jZiZYlbzPk4x48bmRkMBPvtovs3CkAQ0HJHBsJYIhgX+wUuxk+UbmpTIsOL4SYSiKf6uNYqnyu6yTvkmVCIIs+Cerw3usNNupq8KC+ahYivsz0PH/CKsmMqcI0Nc0cyRQ3Cu+2j/I+vHfqJxlt8RKxP3+w68aXmwsdP7dOLulViJ+smEtnK0fMLtJ33SBf/01wxuXyNnGi4TzbxZxAguRbWsjb0TzDxdxEkPjg2lVDv5etEY9hBOI/MIfQR88HWgR94ZUgdVDvCGxsfIXv+KfQHx7j/ZF8aZnycLQLlVBBIv8LzS1H49/uVfU9KqiREFv0fTfG5MuzUFKKhnaLKQfPkZRFEVRFEVRFEVRFEVRFEVRFEVRFEVRFEVRFEVRFEVR/l88X6+2Df9/Ps4pq1aB4f/3fCnmtTkg4v/TJz/LIZ2LzRCPJnJYWdtOAyKT5w/A5eYpixu+sqJr23MHHddVx1GteGwH0kSPemoH+6vbaT6u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"/></span>
    <table cellpadding="0" cellspacing="0">
   <tbody><tr>
    <td height="19" class="xl65" width="64" style="height:14.4pt;width:48pt"></td>
   </tr>
  </tbody></table>
  </span></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl66" width="64" style="width:48pt"></td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl65" style="height:14.4pt"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl66"></td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl65" style="height:14.4pt"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl66"></td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="3" height="19" class="xl67" style="height:14.4pt">EXECUTIVE JETZ
  HANDLING SRL</td>
  <td class="xl68"></td>
  <td colspan="3" rowspan="2" class="xl69">CHARGE NOTE</td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl66"></td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="3" height="19" class="xl70" style="height:14.4pt"><a href="mailto:ops@jetzhandling.com" target="_parent"><span style="font-size:
  10.0pt;font-family:&quot;Opens sans&quot;;mso-generic-font-family:auto;mso-font-charset:
  0">ops@jetzhandling.com</span></a></td>
  <td class="xl70"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl66"></td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="3" height="19" class="xl65" style="height:14.4pt">Chisinau, Republic
  of Moldova</td>
  <td class="xl65"></td>
  <td class="xl71"></td>
  <td class="xl71"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl66"></td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td colspan="2" height="20" class="xl68" style="height:15.0pt">CHARGE NOTE No.</td>
  <td class="xl72">${dayjs().format("DD/MMM/YY")}</td>
  <td class="xl73">//</td>
  <td class="xl65">${flight?.aircraftRegistration || ""}</td>
  <td class="xl74">// ${flight?.flightId}</td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl66"></td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl75" style="height:14.4pt">A/C TYPE</td>
  <td class="xl76" style="border-left:none">${flight?.aircraftType}</td>
  <td colspan="3" class="xl77" style="border-right:1.0pt solid black">ARRIVAL</td>
  <td colspan="2" class="xl77" style="border-right:1.0pt solid black;border-left:
  none">DEPARTURE</td>
  <td colspan="3" class="xl80" style="border-right:1.0pt solid black;border-left:
  none">CARRIER</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl83" style="height:14.4pt;border-top:none">A/C REG</td>
  <td class="xl84" style="border-top:none;border-left:none">${
    flight?.aircraftRegistration
  }</td>
  <td class="xl85" style="border-top:none">FROM</td>
  <td class="xl86" style="border-top:none">&nbsp;</td>
  <td class="xl87" style="border-top:none">${flight?.arrival?.from || "-"}</td>
  <td class="xl85" style="border-top:none;border-left:none">TO</td>
  <td class="xl87" style="border-top:none;border-left:none">${
    flight?.departure?.to || "-"
  }</td>
  <td colspan="3" rowspan="3" class="xl88" style="border-right:1.0pt solid black">${
    flight?.operatorName || ""
  }</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl91" style="height:14.4pt;border-top:none">FLT NO.</td>
  <td class="xl92" style="border-top:none;border-left:none">${
    flight?.flightNumber || ""
  }</td>
  <td class="xl85" style="border-top:none">DATE</td>
  <td class="xl86" style="border-top:none">&nbsp;</td>
  <td class="xl93" style="border-top:none">${
    flight?.arrival?.arrivalDate
      ? dayjs(flight?.arrival?.arrivalDate).format("DD-MMM-YY")
      : ""
  }</td>
  <td class="xl85" style="border-top:none;border-left:none">DATE</td>
  <td class="xl94" style="border-top:none;border-left:none">${
    flight?.departure?.departureDate
      ? dayjs(flight?.departure?.departureDate).format("DD-MMM-YY")
      : ""
  }</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl98" style="height:15.0pt;border-top:none">PAID BY</td>
  <td class="xl99" style="border-top:none;border-left:none">${
    flight?.chargeNote?.paymentType
  }</td>
  <td class="xl100" style="border-top:none">UTC</td>
  <td class="xl101" style="border-top:none">&nbsp;</td>
  <td class="xl102" style="border-top:none">${
    flight?.arrival?.arrivalTime
      ? getParsedDateTime(new Date(), flight?.arrival?.arrivalTime).format(
          "HH:mm"
        )
      : "-"
  }</td>
  <td class="xl100" style="border-top:none;border-left:none">UTC</td>
  <td class="xl103" style="border-top:none;border-left:none">${
    flight?.departure?.departureTime
      ? getParsedDateTime(new Date(), flight?.departure?.departureTime).format(
          "HH:mm"
        )
      : "-"
  }</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="5" height="19" class="xl104" style="height:14.4pt">ITEMS with VAT = 0%</td>
  <td class="xl107" style="border-left:none">QTY</td>
  <td colspan="2" class="xl108">PRICE (EUR)</td>
  <td colspan="2" class="xl107" style="border-right:1.0pt solid black">TOTAL (EUR)</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="5" height="19" class="xl111" style="height:14.4pt">Basic Handling</td>
  <td class="xl92" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl114" style="border-right:.5pt solid black">${basicHandlingWithoutVAT.toFixed(
    2
  )}</td>
  <td colspan="2" rowspan="2" class="xl116" style="border-right:1.0pt solid black">${basicHandlingWithoutVAT.toFixed(
    2
  )}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl118" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td class="xl119" style="border-top:none">&nbsp;</td>
  <td class="xl119" style="border-top:none">&nbsp;</td>
  <td class="xl119" style="border-top:none">&nbsp;</td>
  <td class="xl120" style="border-top:none">&nbsp;</td>
  <td class="xl121" style="border-top:none;border-left:none">&nbsp;</td>
  <td colspan="2" class="xl114" style="border-right:.5pt solid black">&nbsp;</td>
 </tr>
 <!--ADDITIONAL SERVICES -->
 <tr height="19" style="height:14.4pt">
  <td colspan="5" height="19" class="xl135" style="border-right:.5pt solid black;
  height:14.4pt">Additional services</td>
  <td class="xl92" style="border-left:none">&nbsp;</td>
  <td class="xl114" style="border-top:none">&nbsp;</td>
  <td class="xl115" style="border-top:none">&nbsp;</td>
  <td class="xl116"></td>
  <td class="xl138">&nbsp;</td>
 </tr>
 ${additionalServicesRenderHTML()}
 <tr height="19" style="height:14.4pt">
  <td colspan="5" height="19" class="xl135" style="border-right:.5pt solid black;
  height:14.4pt">Third party service providers</td>
  <td class="xl92" style="border-left:none">&nbsp;</td>
  <td class="xl114" style="border-top:none">&nbsp;</td>
  <td class="xl115" >&nbsp;</td>
  <td class="xl116"></td>
  <td class="xl138">&nbsp;</td>
 </tr>
 ${thirdPartyServiceProvidersRenderHTML()}
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl135" colspan="2" style="height:14.4pt;mso-ignore:colspan">Disbursement
  fees</td>
  <td class="xl136">&nbsp;</td>
  <td class="xl136">&nbsp;</td>
  <td class="xl152">&nbsp;</td>
  <td class="xl146">&nbsp;</td>
  <td class="xl124">&nbsp;</td>
  <td class="xl125">&nbsp;</td>
  <td class="xl153">&nbsp;</td>
  <td class="xl154">&nbsp;</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl142" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td class="xl134" colspan="2" style="mso-ignore:colspan">Airport fees</td>
  <td class="xl134" style="border-top:none">&nbsp;</td>
  <td class="xl128" style="border-top:none">&nbsp;</td>
  <td class="xl155" style="border-top:none">${
    disbursementPercentage
  }%</td>
  <td class="xl114" style="border-top:none">&nbsp;</td>
  <td class="xl115" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl114" style="border-right:1.0pt solid black">${Number(
    flight?.providedServices?.disbursementFees?.airportFee
  ).toFixed(2)}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl142" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td class="xl134" style="border-top:none">Catering</td>
  <td class="xl134" style="border-top:none">&nbsp;</td>
  <td class="xl134" style="border-top:none">&nbsp;</td>
  <td class="xl128" style="border-top:none">&nbsp;</td>
  <td class="xl155" style="border-top:none">${
    disbursementPercentage
  }%</td>
  <td class="xl114" style="border-top:none">&nbsp;</td>
  <td class="xl115" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl114" style="border-right:1.0pt solid black">${Number(
    flight?.providedServices?.disbursementFees?.cateringFee
  ).toFixed(2)}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl127" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td class="xl134" style="border-top:none">Fuel</td>
  <td class="xl134" style="border-top:none">&nbsp;</td>
  <td class="xl134" style="border-top:none">&nbsp;</td>
  <td class="xl128" style="border-top:none">&nbsp;</td>
  <td class="xl155" style="border-top:none">${
   disbursementPercentage
  }%</td>
  <td class="xl114" style="border-top:none">&nbsp;</td>
  <td class="xl115" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl114" style="border-right:1.0pt solid black">${Number(
    flight?.providedServices?.disbursementFees?.fuelFee
  ).toFixed(2)}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl156" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td class="xl134" style="border-top:none">HOTAC</td>
  <td class="xl134" style="border-top:none">&nbsp;</td>
  <td class="xl134" style="border-top:none">&nbsp;</td>
  <td class="xl128" style="border-top:none">&nbsp;</td>
  <td class="xl157" style="border-top:none">${
   disbursementPercentage
  }%</td>
  <td class="xl158" style="border-top:none">&nbsp;</td>
  <td class="xl159" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl114" style="border-right:1.0pt solid black">${Number(
    flight?.providedServices?.disbursementFees?.HOTACFee
  ).toFixed(2)}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl118" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl134" style="border-right:.5pt solid black">Express/VIP
  Terminal</td>
  <td class="xl157" style="border-top:none">${
    disbursementPercentage
  }%</td>
  <td class="xl160" style="border-top:none">&nbsp;</td>
  <td class="xl161" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl114" style="border-right:1.0pt solid black">${Number(
    flight?.providedServices?.disbursementFees?.VIPLoungeFee
  ).toFixed(2)}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl118" style="height:14.4pt">&nbsp;</td>
  <td class="xl66"></td>
  <td class="xl66"></td>
  <td class="xl66"></td>
  <td class="xl66"></td>
  <td class="xl162">&nbsp;</td>
  <td class="xl163">&nbsp;</td>
  <td class="xl164" style="border-top:none">TOTAL</td>
  <td colspan="2" class="xl165" style="border-right:1.0pt solid black">${servicesTotalAmountNoVAT.toFixed(
    2
  )}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl139" style="height:14.4pt">&nbsp;</td>
  <td class="xl66"></td>
  <td class="xl66"></td>
  <td class="xl66"></td>
  <td class="xl66"></td>
  <td class="xl162">&nbsp;</td>
  <td class="xl66"></td>
  <td class="xl164" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl167" style="border-right:1.0pt solid black">VAT = 0%</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl169" style="height:15.0pt">&nbsp;</td>
  <td class="xl170">&nbsp;</td>
  <td class="xl170">&nbsp;</td>
  <td class="xl170">&nbsp;</td>
  <td class="xl170">&nbsp;</td>
  <td class="xl171">&nbsp;</td>
  <td colspan="2" class="xl172" style="border-right:.5pt solid black;border-left:
  none">TOTAL MDL</td>
  <td colspan="2" class="xl174" style="border-right:1.0pt solid black">${convertCurrency(
    servicesTotalAmountNoVAT,
    1 / Number(flight?.chargeNote?.currency?.euroToMDL)
  ).toFixed(2)}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="3" height="19" class="xl176" style="height:14.4pt">Services with VAT
  ${config?.VAT}%</td>
  <td class="xl178" style="border-top:none">&nbsp;</td>
  <td class="xl178" style="border-top:none">&nbsp;</td>
  <td class="xl179" style="border-top:none">&nbsp;</td>
  <td class="xl178" style="border-top:none">&nbsp;</td>
  <td class="xl179" style="border-top:none">&nbsp;</td>
  <td class="xl178" style="border-top:none">&nbsp;</td>
  <td class="xl180" style="border-top:none">&nbsp;</td>
 </tr>
${VATApplicableServicesRenderHTML()}
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl184" style="height:14.4pt">Billing to:</td>
  <td colspan="5" rowspan="7" class="xl185" width="320" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black;width:240pt">${
    flight?.chargeNote?.billingTo
  }</td>
  <td class="xl187" style="border-top:none;border-left:none">&nbsp;</td>
  <td class="xl188" style="border-top:none">TOTAL:</td>
  <td colspan="2" class="xl189" style="border-right:1.0pt solid black">${servicesTotalAmountWithVAT.toFixed(
    2
  )}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl191" style="height:14.4pt">&nbsp;</td>
  <td class="xl187" style="border-left:none">&nbsp;</td>
  <td class="xl188">&nbsp;</td>
  <td colspan="2" class="xl194" style="border-right:1.0pt solid black;border-left:
  none">VAT = ${config.VAT}%</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl139" style="height:15.0pt">&nbsp;</td>
  <td colspan="2" class="xl195" style="border-right:.5pt solid black;border-left:
  none">TOTAL MDL</td>
  <td colspan="2" class="xl197" style="border-right:1.0pt solid black;border-left:
  none">${convertCurrency(
    servicesTotalAmountWithVAT,
    1 / Number(flight?.chargeNote?.currency?.euroToMDL)
  ).toFixed(2)}</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl199" width="64" style="height:15.0pt;width:48pt">&nbsp;</td>
  <td colspan="2" class="xl200" style="border-right:.5pt solid black;border-left:
  none">GRAND TOTAL MDL</td>
  <td colspan="2" class="xl202" style="border-right:1.0pt solid black">${(
    convertCurrency(
      servicesTotalAmountNoVAT,
      1 / Number(flight?.chargeNote?.currency?.euroToMDL)
    ) +
    convertCurrency(
      servicesTotalAmountWithVAT,
      1 / Number(flight?.chargeNote?.currency?.euroToMDL)
    )
  ).toFixed(2)}</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl199" width="64" style="height:15.0pt;width:48pt">&nbsp;</td>
  <td colspan="2" class="xl204" style="border-right:1.0pt solid black">EUR to MDL
  rate</td>
  <td colspan="2" class="xl206" style="border-right:1.0pt solid black;border-left:
  none">Issue date</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl199" width="64" style="height:14.4pt;width:48pt">&nbsp;</td>
  <td rowspan="2" class="xl207" style="border-bottom:1.0pt solid black;border-top:
  none">1 EUR =</td>
  <td rowspan="2" class="xl208" style="border-bottom:1.0pt solid black;border-top:
  none">${Number(flight?.chargeNote?.currency?.euroToMDL).toFixed(2)}</td>
  <td colspan="2" rowspan="2" class="xl209" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black">${dayjs().format("DD-MMM-YY")}</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl211" width="64" style="height:15.0pt;width:48pt">&nbsp;</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl184" style="height:14.4pt;border-top:none">Remarks:</td>
  <td colspan="9" rowspan="3" class="xl218" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black">${flight?.chargeNote?.remarks || ""}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl139" style="height:14.4pt">&nbsp;</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl139" style="height:15.0pt">&nbsp;</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl184" colspan="4" style="height:14.4pt;mso-ignore:colspan">Name
  and signature of handling agent</td>
  <td class="xl226" style="border-top:none">&nbsp;</td>
  <td class="xl227" colspan="5" style="mso-ignore:colspan;border-right:1.0pt solid black">Name
  and signature of Crew/Carrier representative</td>
 </tr>
 <tr>
 <td colspan="5"  style="border-right:1.0pt solid black;border-left:1.0pt solid black">${
   flight!.ramp!.name
 }</td>
 <td colspan="5"  style="border-right:1.0pt solid black;border-left:1.0pt solid black"">${
   flight!.crew!.name
 }</td>
 </tr>

 <tr height="19" style="height:10.4pt">
  <td colspan="5" " class="xl228" style="border-right:1.0pt solid black;border-bottom:1.0pt solid black;
  "><img  width="320" height="120" src="data:image/png;base64,${
    flight?.ramp?.signature
  }"/></td>
  <td class="xl170" style="border-left:none"><img  width="320" height="120" src="data:image/png;base64,${
    flight?.crew?.signature
  }"/></td>
  <td class="xl170"></td>
  <td class="xl170"></td>
  <td class="xl170"></td>
  <td  style="border-right:1.0pt solid black;
  "class="xl170">&nbsp;</td>
 </tr>
 <!--[if supportMisalignedColumns]-->
 <tr height="0" style="display:none">
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
 </tr>
 <!--[endif]-->
</tbody></table>




</body></html>`;
}
