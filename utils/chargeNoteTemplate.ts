import { Flight } from "@/redux/types";
import dayjs from "dayjs";
import getParsedDateTime from "./getParsedDateTime";
import { getLoungeFeePrice } from "@/services/servicesCalculator";
import convertCurrency from "./convertCurrency";
import { store } from "@/redux/store";
import { getFuelFeeAmount } from "@/services/AirportFeesManager";
export default function chargeNoteTemplateHTML(flight: Flight) {
  const additionalServicesRenderHTML = () => {
    let resultHTML = "";

    flight?.providedServices?.otherServices?.forEach((serviceCategory) => {
      serviceCategory?.services.map((s) => {
        if (s?.isUsed) {
          const [price] = s.pricingRules.map((rule) => {
            if (rule?.ruleName === "pricePerQty") return rule?.amount;
          });
          const quantity = s?.quantity;

          resultHTML += `<tr height="19" style="height:14.4pt">
          <td height="19" class="xl144" style="height:14.4pt">&nbsp;</td>
          <td colspan="4" class="xl148" style="border-right:1.0pt solid black">${
            s.serviceName
          }</td>
          <td class="xl147">${quantity || 0}</td>
          <td colspan="2" class="xl150" style="border-right:1.0pt solid black;border-left:
  none">${price || 0}</td>
          <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">${(price || 0) * quantity}</td>
        </tr>`;
        }
      });
    });

    return resultHTML;
  };

  const thirdPartyServiceProvidersRenderHTML = () => {
    const config = store.getState().general;
    const VIPTerminalPrice = getLoungeFeePrice(
      flight,
      flight?.handlingType
    ).amount;
    return `<tr height="19" style="height:14.4pt">
          <td colspan="5" height="19" class="xl154" style="border-right:1.0pt solid black;
  height:14.4pt">Third party service providers</td>
          <td class="xl127">&nbsp;</td>
          <td colspan="2" class="xl126" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
          <td colspan="2" class="xl158" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
        </tr>
         <tr height="19" style="height:14.4pt">
          <td height="19" class="xl160" style="height:14.4pt;border-top:none">&nbsp;</td>
          <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Express / VIP Terminal</td>
          <td class="xl133" style="border-top:none">&nbsp;</td>
          <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
          <td colspan="2" class="xl161" style="border-right:1.0pt solid black;border-left:
  none">${
    Number(convertCurrency(VIPTerminalPrice, Number(config.euroToMDL))).toFixed(
      2
    ) || 0
  }</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl160" style="height:14.4pt;border-top:none">&nbsp;</td>
          <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Airport fees</td>
          <td class="xl135" style="border-top:none">&nbsp;</td>
          <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
          <td colspan="2" class="xl161" style="border-right:1.0pt solid black;border-left:
  none">${
    Number(flight?.providedServices?.supportServices.airportFee?.total).toFixed(
      2
    ) || 0
  }</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl160" style="height:14.4pt;border-top:none">&nbsp;</td>
          <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Catering</td>
          <td class="xl133" style="border-top:none">&nbsp;</td>
          <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
          <td colspan="2" class="xl161" style="border-right:1.0pt solid black;border-left:
  none">${
    Number(flight?.providedServices?.supportServices.catering.total).toFixed(
      2
    ) || 0
  }</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl160" style="height:14.4pt;border-top:none">&nbsp;</td>
          <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Fuel</td>
          <td class="xl163" style="border-top:none">&nbsp;</td>
          <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
          <td colspan="2" class="xl164" width="128" style="border-right:1.0pt solid black;
  border-left:none;width:96pt">${getFuelFeeAmount({
    ...flight?.providedServices?.supportServices?.fuel,
    flight,
  }).toFixed(2)}</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td height="20" class="xl166" style="height:15.0pt;border-top:none">&nbsp;</td>
          <td colspan="4" class="xl148" style="border-right:1.0pt solid black">HOTAC</td>
          <td class="xl167" style="border-top:none;border-left:none">&nbsp;</td>
          <td colspan="2" class="xl122" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
          <td colspan="2" class="xl161" style="border-right:1.0pt solid black;border-left:
  none">${
    Number(flight?.providedServices?.supportServices.HOTAC.total).toFixed(2) ||
    0
  }</td>
        </tr>`;
  };

  return `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head>
    <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
    <meta name="ProgId" content="Excel.Sheet">
    <meta name="Generator" content="Microsoft Excel 15">
    <style>
      tr {
        mso-height-source: auto;
      }

      col {
        mso-width-source: auto;
      }

      br {
        mso-data-placement: same-cell;
      }

      .style62 {
        color: #0563C1;
        font-size: 11.0pt;
        font-weight: 400;
        font-style: normal;
        text-decoration: underline;
        text-underline-style: single;
        font-family: Calibri, sans-serif;
        mso-font-charset: 0;
        mso-style-name: Hyperlink;
        mso-style-id: 8;
      }

      a:link {
        color: #0563C1;
        font-size: 11.0pt;
        font-weight: 400;
        font-style: normal;
        text-decoration: underline;
        text-underline-style: single;
        font-family: Calibri, sans-serif;
        mso-font-charset: 0;
      }

      a:visited {
        color: #954F72;
        font-size: 11.0pt;
        font-weight: 400;
        font-style: normal;
        text-decoration: underline;
        text-underline-style: single;
        font-family: Calibri, sans-serif;
        mso-font-charset: 0;
      }

      .style0 {
        mso-number-format: General;
        text-align: general;
        vertical-align: bottom;
        white-space: nowrap;
        mso-rotate: 0;
        mso-background-source: auto;
        mso-pattern: auto;
        color: black;
        font-size: 11.0pt;
        font-weight: 400;
        font-style: normal;
        text-decoration: none;
        font-family: Calibri, sans-serif;
        mso-font-charset: 0;
        border: none;
        mso-protection: locked visible;
        mso-style-name: Normal;
        mso-style-id: 0;
      }

      td {
        mso-style-parent: style0;
        padding: 0px;
        mso-ignore: padding;
        color: black;
        font-size: 11.0pt;
        font-weight: 400;
        font-style: normal;
        text-decoration: none;
        font-family: Calibri, sans-serif;
        mso-font-charset: 0;
        mso-number-format: General;
        text-align: general;
        vertical-align: bottom;
        border: none;
        mso-background-source: auto;
        mso-pattern: auto;
        mso-protection: locked visible;
        white-space: nowrap;
        mso-rotate: 0;
      }

      .xl65 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
      }

      .xl66 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
      }

      .xl67 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl68 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
      }

      .xl69 {
        mso-style-parent: style0;
        font-size: 16.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
      }

      .xl70 {
        mso-style-parent: style62;
        color: #0563C1;
        font-size: 10.0pt;
        text-decoration: underline;
        text-underline-style: single;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
      }

      .xl71 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        vertical-align: middle;
      }

      .xl72 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: "\[ENG\]\[$-409\]dd\/mmm\/yy\;\@";
        text-align: center;
        vertical-align: middle;
      }

      .xl73 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: "Short Date";
        text-align: center;
        vertical-align: middle;
      }

      .xl74 {
        mso-style-parent: style0;
        color: windowtext;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl75 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl76 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl77 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl78 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl79 {
        mso-style-parent: style0;
        color: #31394D;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl80 {
        mso-style-parent: style0;
        color: #31394D;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl81 {
        mso-style-parent: style0;
        color: #31394D;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl82 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl83 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border: .5pt solid windowtext;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl84 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl85 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl86 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl87 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl88 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: none;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl89 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl90 {
        mso-style-parent: style0;
        color: #31394D;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl91 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border: .5pt solid windowtext;
      }

      .xl92 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: "Medium Date";
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl93 {
        mso-style-parent: style0;
        color: #31394D;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: "Medium Date";
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl94 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl95 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl96 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl97 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl98 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: none;
        border-left: .5pt solid windowtext;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl99 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl100 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: none;
      }

      .xl101 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: "Short Time";
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: .5pt solid windowtext;
      }

      .xl102 {
        mso-style-parent: style0;
        color: #31394D;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: "Short Time";
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: .5pt solid windowtext;
      }

      .xl103 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl104 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl105 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl106 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border: 1.0pt solid windowtext;
      }

      .xl107 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl108 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl109 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: none;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl110 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: none;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl111 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl112 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl113 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl114 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl115 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl116 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl117 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
      }

      .xl118 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl119 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl120 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl121 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl122 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl123 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl124 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl125 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl126 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl127 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl128 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl129 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl130 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border: .5pt solid windowtext;
      }

      .xl131 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl132 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl133 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl134 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl135 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl136 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl137 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border: .5pt solid windowtext;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl138 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl139 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
        white-space: nowrap;
        mso-text-control: shrinktofit;
      }

      .xl140 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        border-top: .5pt solid windowtext;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl141 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        border: .5pt solid windowtext;
      }

      .xl142 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl143 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl144 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl145 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl146 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl147 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
      }

      .xl148 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: none;
      }

      .xl149 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
      }

      .xl150 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl151 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
      }

      .xl152 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl153 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl154 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        border-top: none;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl155 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        border-top: none;
        border-right: .5pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl156 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        border-top: none;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl157 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: .5pt solid windowtext;
      }

      .xl158 {
        mso-style-parent: style0;
        color: windowtext;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        border-top: none;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl159 {
        mso-style-parent: style0;
        color: windowtext;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl160 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl161 {
        mso-style-parent: style0;
        color: windowtext;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl162 {
        mso-style-parent: style0;
        color: windowtext;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl163 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl164 {
        mso-style-parent: style0;
        color: windowtext;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
        white-space: normal;
      }

      .xl165 {
        mso-style-parent: style0;
        color: windowtext;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
        white-space: normal;
      }

      .xl166 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl167 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl168 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl169 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl170 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl171 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl172 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl173 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: 0%;
        text-align: center;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl174 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl175 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl176 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl177 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: 0%;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl178 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: none;
        border-bottom: .5pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl179 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: .5pt solid windowtext;
        border-left: none;
      }

      .xl180 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
      }

      .xl181 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: 0%;
        text-align: center;
        vertical-align: middle;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl182 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: .5pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl183 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl184 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl185 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: none;
      }

      .xl186 {
        mso-style-parent: style0;
        font-size: 7.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: none;
        white-space: normal;
        mso-text-control: shrinktofit;
      }

      .xl187 {
        mso-style-parent: style0;
        font-size: 7.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
        white-space: normal;
        mso-text-control: shrinktofit;
      }

      .xl188 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl189 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl190 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl191 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl192 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: top;
        border-top: none;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
        white-space: normal;
        mso-text-control: shrinktofit;
      }

      .xl193 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: top;
        white-space: normal;
        mso-text-control: shrinktofit;
      }

      .xl194 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: top;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
        white-space: normal;
        mso-text-control: shrinktofit;
      }

      .xl195 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
        mso-protection: unlocked visible;
      }

      .xl196 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: 0%;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
        mso-protection: unlocked visible;
      }

      .xl197 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: .5pt solid windowtext;
        mso-protection: unlocked visible;
      }

      .xl198 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl199 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl200 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl201 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: Fixed;
        text-align: center;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl202 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl203 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl204 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: none;
      }

      .xl205 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: "0\.0000";
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
      }

      .xl206 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: "Medium Date";
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl207 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
      }

      .xl208 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: top;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
        white-space: normal;
        mso-text-control: shrinktofit;
      }

      .xl209 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: top;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
        white-space: normal;
        mso-text-control: shrinktofit;
      }

      .xl210 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: top;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
        white-space: normal;
        mso-text-control: shrinktofit;
      }

      .xl211 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl212 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        mso-number-format: "0\.0000";
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl213 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl214 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl215 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-style: italic;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: none;
        mso-protection: unlocked visible;
      }

      .xl216 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: none;
        mso-protection: unlocked visible;
      }

      .xl217 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
        mso-protection: unlocked visible;
      }

      .xl218 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: none;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl219 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        mso-protection: unlocked visible;
      }

      .xl220 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
        mso-protection: unlocked visible;
      }

      .xl221 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
        mso-protection: unlocked visible;
      }

      .xl222 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
        mso-protection: unlocked visible;
      }

      .xl223 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: 1.0pt solid windowtext;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
      }

      .xl224 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: 1.0pt solid windowtext;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl225 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl226 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: center;
        vertical-align: middle;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
      }

      .xl227 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: none;
        border-left: none;
      }

      .xl228 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: none;
        border-left: 1.0pt solid windowtext;
      }

      .xl229 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-weight: 700;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        text-align: left;
        vertical-align: middle;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      .xl230 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl231 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: none;
        border-right: 1.0pt solid windowtext;
        border-bottom: 1.0pt solid windowtext;
        border-left: none;
      }

      .xl232 {
        mso-style-parent: style0;
        font-size: 10.0pt;
        font-family: "Opens sans";
        mso-generic-font-family: auto;
        mso-font-charset: 0;
        border-top: none;
        border-right: none;
        border-bottom: 1.0pt solid windowtext;
        border-left: 1.0pt solid windowtext;
      }

      < !--table {
        mso-displayed-decimal-separator: "\.";
        mso-displayed-thousand-separator: "\,";
      }

      @page {
        margin: .3in .3in .3in .3in;
        mso-header-margin: .3in;
        mso-footer-margin: .3in;
      }

      -->
    </style>
  <style>@font-face {
              font-family: 'Open Sans Regular';
              font-style: normal;
              font-weight: 400;
              src: url('chrome-extension://gkkdmjjodidppndkbkhhknakbeflbomf/fonts/open_sans/open-sans-v18-latin-regular.woff');
          }</style><style>@font-face {
              font-family: 'Open Sans Bold';
              font-style: normal;
              font-weight: 800;
              src: url('chrome-extension://gkkdmjjodidppndkbkhhknakbeflbomf/fonts/open_sans/OpenSans-Bold.woff');
          }</style><style>@font-face {
              font-family: 'Open Sans ExtraBold';
              font-style: normal;
              font-weight: 800;
              src: url('chrome-extension://gkkdmjjodidppndkbkhhknakbeflbomf/fonts/open_sans/open-sans-v18-latin-800.woff');
          }</style><script src="chrome-extension://mooikfkahbdckldjjndioackbalphokd/assets/prompt.js"></script></head>
  <body link="#0563C1" vlink="#954F72">
    <table border="0" cellpadding="0" cellspacing="0" width="840" style="
 border-collapse:
 collapse;
 table-layout:fixed;
 width: 100%;
 ">
      <colgroup>
        <col width="64" span="10" style="width: 100%;">
      </colgroup>
      <tbody>
        <tr height="19" style="height:14.4pt">
          <td height="19" width="64" style="height:14.4pt;width:48pt" align="left" valign="top">
            <span style="mso-ignore:vglayout;
  position:absolute;z-index:1;margin-left:2px;margin-top:0px;width:635px;
  height:128px">
              <img width="835" height="50" src="data:image/png;base64,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" v:shapes="Shape_x0020_2 Shape_x0020_3 Shape_x0020_4 Shape_x0020_5 Shape_x0020_6 Shape_x0020_7 Shape_x0020_8 Shape_x0020_9 Shape_x0020_10 Shape_x0020_11 Shape_x0020_12 Picture_x0020_12">
            </span>
             <span style="mso-ignore:vglayout;
  position:absolute;z-index:1; right:0;
  top:60;
  height:128px">
              <img width="130" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWQAAADVCAMAAABXJHp2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURf///+7u7tPT0729vcTExOnp6ezs7MLCwsHBwbq6unp6eisrKwAAAAEBAW1tbe/v787OznFxcXx8fPT09Nra2sfHxw0NDYuLi/n5+crKyjAwMJ+fn/7+/vX19c3NzWxsbLGxsfDw8M/Pz46Ojru7u/z8/NLS0tXV1SYmJvLy8tTU1FNTU+jo6NjY2MnJyQkJCSIiIvr6+hEREUZGRuvr69vb22traxwcHCQkJPHx8fb29lJSUt3d3WlpaRgYGODg4F9fX4qKihMTEx8fH8vLyxkZGePj4wcHB7W1tXd3d+fn5+Xl5QoKChoaGmVlZeLi4hQUFIWFhaqqqgQEBAMDAxYWFhcXF+rq6lpaWhUVFdbW1qmpqW5ubgwMDCkpKdnZ2f39/ZGRkRAQEK6ursDAwNDQ0AICAg8PD9zc3AUFBczMzPPz80BAQNfX1wsLC3V1dcXFxfv7+15eXra2trm5uff39/j4+HJycnBwcAYGBoODg7i4uCMjI62trUlJSd/f34mJiWJiYn19faKioubm5pOTk5aWlk1NTXZ2dpycnN7e3ldXV2hoaH9/f4SEhGdnZ9HR0VtbW4aGhnt7e5CQkFRUVK+vrz4+PoGBgaWlpbS0tJiYmFBQUI2NjVxcXEpKSiwsLKCgoIeHh2FhYZqamu3t7cbGxjs7O+Tk5GpqakRERJKSkmNjY4iIiLe3tyUlJU5OTuHh4UdHRzw8PBsbGx0dHR4eHkVFRUNDQ7CwsG9vbzIyMpWVlXR0dIKCgp2dnaGhoaSkpKOjo6ampqenp56enqioqL+/v2ZmZggICDo6OlFRUYCAgHl5eWRkZL6+vg4ODjc3NyoqKkJCQn5+fjU1NS8vLy4uLoyMjDExMZubm3h4eF1dXT8/P1VVVZeXl7Ozs0tLS0xMTLKyslZWVry8vD09PSgoKMjIyDk5OUFBQS0tLRISEiEhITMzMycnJzY2NpmZmTg4OI+Pj8PDw0hISKurqzQ0NJSUlGBgYCAgIHNzc09PT6ysrFlZWQAAANQqSogAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAACHVAAAh1QEEnLSdAAAMZUlEQVR4Xu2d25GrOBCGzbvDIAAXzyTA64RBaK4iD6JwCFSRwfYvNXc11gWM16e/3TkzIEDST9MSQpeboiiKoiiKoiiKoiiKoiiKoiiKoijKd5KVeV5nvKEcTVbndZ5Xj/v93uJPVfpgSNS6JXXnVDkHKumUdV2zriuamg9REshI3xr+QaJXmdMgfdcewsEfH62EAgtuWMV3qGeOoKzLumIBvfjBWgZJUJ6WrZIuztJ58/g5kcsc+XqekK+sJIWNamE8+PwfgnN2sMoQ2KOMc1D8nh0TnLkDVY4W+FclvmWcvfvriOyRvqVvJWJL8fjRSnJWcA7vLe+JpcyiXPBI8fjduttoyvcq3pZJ4Ok6URSp9/irKUdTvje8K4iM9P3jC0RSFEVU1P8jZiZYlbzPk4x48bmRkMBPvtovs3CkAQ0HJHBsJYIhgX+wUuxk+UbmpTIsOL4SYSiKf6uNYqnyu6yTvkmVCIIs+Cerw3usNNupq8KC+ahYivsz0PH/CKsmMqcI0Nc0cyRQ3Cu+2j/I+vHfqJxlt8RKxP3+w68aXmwsdP7dOLulViJ+smEtnK0fMLtJ33SBf/01wxuXyNnGi4TzbxZxAguRbWsjb0TzDxdxEkPjg2lVDv5etEY9hBOI/MIfQR88HWgR94ZUgdVDvCGxsfIXv+KfQHx7j/ZF8aZnycLQLlVBBIv8LzS1H49/uVfU9KqiREFv0fTfG5MuzUFKKhnaLKQfPkZRFEVRFEVRFEVRFEVRFEVRFEVRFEVRFEVRFEVRFEVR/l88X6+2Df9/Ps4pq1aB4f/3fCnmtTkg4v/TJz/LIZ2LzRCPJnJYWdtOAyKT5w/A5eYpixu+sqJr23MHHddVx1GteGwH0kSPemoH+6vbaT6u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"</span>
            <!--[endif]-->
            <span style="mso-ignore:vglayout2">
              <table cellpadding="0" cellspacing="0">
                <tbody>
                  <tr>
                    <td height="19" class="xl65" width="64" style="height:2.4pt;width:48pt"></td>
                  </tr>
                </tbody>
              </table>
            </span>
          </td>
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
          <td colspan="3" height="19" class="xl67" style="height:14.4pt">EXECUTIVE JETZ HANDLING SRL</td>
          <td class="xl68"></td>
          <td colspan="3" rowspan="2" class="xl69">CHARGE NOTE</td>
          <td class="xl65"></td>
          <td class="xl65"></td>
          <td class="xl66"></td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td colspan="3" height="19" class="xl70" style="height:14.4pt">
            <a href="mailto:ops@jetzhandling.com" target="_parent">
              <span style="font-size:
  10.0pt;font-family:&quot;Opens sans&quot;;mso-generic-font-family:auto;mso-font-charset:
  0">ops@jetzhandling.com</span>
            </a>
          </td>
          <td class="xl70"></td>
          <td class="xl65"></td>
          <td class="xl65"></td>
          <td class="xl66"></td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td colspan="3" height="19" class="xl65" style="height:14.4pt">Chisinau, Republic of Moldova</td>
          <td class="xl65"></td>
          <td class="xl71"></td>
          <td class="xl71"></td>
          <td class="xl65"></td>
          <td class="xl65"></td>
          <td class="xl65"></td>
          <td class="xl66"></td>
        </tr>
        <tr height="20" style="height:10.0pt">
          <td colspan="3" height="20" class="xl68" style="height:15.0pt">CHARGE NOTE No.</td>
          <td class="xl72">{{CHARGE NOTE NUMBER}}</td>
          <td class="xl73">//</td>
          <td class="xl65">${flight?.flightNumber}</td>
          <td class="xl65"></td>
          <td class="xl65"></td>
          <td class="xl65"></td>
          <td class="xl65"></td>
          <td class="xl66"></td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl74" style="height:14.4pt">A/C TYPE</td>
          <td class="xl75" style="border-left:none">${flight?.aircraftType}</td>
          <td colspan="3" class="xl76" style="border-right:1.0pt solid black">ARRIVAL</td>
          <td colspan="2" class="xl76" style="border-right:1.0pt solid black;border-left:
  none">DEPARTURE</td>
          <td colspan="3" class="xl79" style="border-right:1.0pt solid black;border-left:
  none">CARRIER</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl82" style="height:14.4pt;border-top:none">A/C REG</td>
          <td class="xl83" style="border-top:none;border-left:none">${
            flight?.aircraftRegistration
          }</td>
          <td class="xl84" style="border-top:none">FROM</td>
          <td class="xl85" style="border-top:none">&nbsp;</td>
          <td class="xl86" style="border-top:none">${flight?.arrival?.from}</td>
          <td class="xl84" style="border-top:none;border-left:none">TO</td>
          <td class="xl86" style="border-top:none;border-left:none">${
            flight?.departure?.to
          }</td>
          <td colspan="3" rowspan="3" class="xl87" style="border-right:1.0pt solid black">${
            flight?.operatorName
          }</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl90" style="height:14.4pt;border-top:none">FLT NO.</td>
          <td class="xl91" style="border-top:none;border-left:none">${
            flight?.flightNumber
          }</td>
          <td class="xl84" style="border-top:none">DATE</td>
          <td class="xl85" style="border-top:none">&nbsp;</td>
          <td class="xl92" style="border-top:none">${dayjs(
            flight?.arrival?.arrivalDate
          ).format("DD-MMM-YY")}</td>
          <td class="xl84" style="border-top:none;border-left:none">DATE</td>
          <td class="xl93" style="border-top:none;border-left:none">${dayjs(
            flight?.departure?.departureDate
          ).format("DD-MMM-YY")}</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td height="20" class="xl97" style="height:15.0pt;border-top:none">PAID BY</td>
          <td class="xl98" style="border-top:none;border-left:none">CARD</td>
          <td class="xl99" style="border-top:none">UTC</td>
          <td class="xl100" style="border-top:none">&nbsp;</td>
          <td class="xl101" style="border-top:none">${getParsedDateTime(
            new Date(),
            flight?.arrival?.arrivalTime
          ).format("HH:mm")}</td>
          <td class="xl99" style="border-top:none;border-left:none">UTC</td>
          <td class="xl102" style="border-top:none;border-left:none">${getParsedDateTime(
            new Date(),
            flight?.departure?.departureTime
          ).format("HH:mm")}</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td colspan="5" height="20" class="xl103" style="height:15.0pt">ITEM</td>
          <td class="xl106">QTY</td>
          <td colspan="2" class="xl107" style="border-right:1.0pt solid black">PRICE (EUR)</td>
          <td colspan="2" class="xl107" style="border-right:1.0pt solid black">TOTAL (EUR)</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td colspan="5" height="19" class="xl109" style="border-right:1.0pt solid black;
  height:14.4pt">Basic Handling</td>
          <td class="xl113">&nbsp;</td>
          <td colspan="2" class="xl114" style="border-right:1.0pt solid black;border-left:
  none">${Number(flight?.providedServices?.basicHandling).toFixed(2)}</td>
          <td colspan="2" rowspan="2" class="xl116" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black">${Number(
    flight?.providedServices?.basicHandling
  ).toFixed(2)}</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td height="20" class="xl118" style="height:15.0pt;border-top:none">&nbsp;</td>
          <td class="xl119" style="border-top:none">&nbsp;</td>
          <td class="xl119" style="border-top:none">&nbsp;</td>
          <td class="xl119" style="border-top:none">&nbsp;</td>
          <td class="xl120" style="border-top:none">&nbsp;</td>
          <td class="xl121" style="border-top:none">&nbsp;</td>
          <td colspan="2" class="xl122" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
        </tr>

        <!-- ADDITIONAL SERVICES START -->
        <tr height="19" style="height:14.4pt">
          <td colspan="5" height="19" class="xl109" style="border-right:1.0pt solid black;
  height:14.4pt">Additional services</td>
          <td class="xl113">&nbsp;</td>
          <td colspan="2" class="xl126" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
          <td colspan="2" class="xl114" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
        </tr>

        <!-- ROW START -->
        ${additionalServicesRenderHTML()}
        <!-- ROW END -->
        
        <tr height="20" style="height:15.0pt">
          <td height="20" class="xl118" style="height:15.0pt">&nbsp;</td>
          <td class="xl152">&nbsp;</td>
          <td class="xl152">&nbsp;</td>
          <td class="xl152">&nbsp;</td>
          <td class="xl153">&nbsp;</td>
          <td class="xl121">&nbsp;</td>
          <td class="xl122" style="border-left:none">&nbsp;</td>
          <td class="xl123">&nbsp;</td>
          <td class="xl122" style="border-top:none;border-left:none">&nbsp;</td>
          <td class="xl123" style="border-top:none">&nbsp;</td>
        </tr>
     ${thirdPartyServiceProvidersRenderHTML()}
        <tr height="19" style="height:14.4pt">
          <td colspan="5" height="19" class="xl168" style="border-right:1.0pt solid black;
  height:14.4pt">Disbursement fees</td>
          <td class="xl113">&nbsp;</td>
          <td class="xl126" style="border-left:none">&nbsp;</td>
          <td class="xl127">&nbsp;</td>
          <td colspan="2" class="xl171" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl160" style="height:14.4pt;border-top:none">&nbsp;</td>
          <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Airport fees</td>
          <td class="xl173" style="border-top:none">10%</td>
          <td class="xl134" style="border-top:none;border-left:none">&nbsp;</td>
          <td class="xl135" style="border-top:none">&nbsp;</td>
          <td colspan="2" class="xl174" style="border-right:1.0pt solid black;border-left:
  none">1.55</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl160" style="height:14.4pt;border-top:none">&nbsp;</td>
          <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Catering</td>
          <td class="xl173" style="border-top:none">10%</td>
          <td class="xl134" style="border-top:none;border-left:none">&nbsp;</td>
          <td class="xl135" style="border-top:none">&nbsp;</td>
          <td colspan="2" class="xl174" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl128" style="height:14.4pt;border-top:none">&nbsp;</td>
          <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Fuel</td>
          <td class="xl173" style="border-top:none">10%</td>
          <td class="xl134" style="border-top:none;border-left:none">&nbsp;</td>
          <td class="xl135" style="border-top:none">&nbsp;</td>
          <td colspan="2" class="xl174" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl176" style="height:14.4pt;border-top:none">&nbsp;</td>
          <td colspan="4" class="xl145" style="border-right:1.0pt solid black">HOTAC</td>
          <td class="xl177" style="border-top:none;border-left:none">10%</td>
          <td class="xl178" style="border-top:none;border-left:none">&nbsp;</td>
          <td class="xl179" style="border-top:none">&nbsp;</td>
          <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td height="20" class="xl118" style="height:15.0pt;border-top:none">&nbsp;</td>
          <td colspan="4" class="xl180">Express/VIP Terminal</td>
          <td class="xl181" style="border-top:none">10%</td>
          <td class="xl66"></td>
          <td class="xl182" style="border-top:none">&nbsp;</td>
          <td colspan="2" class="xl183">0.00</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td height="20" class="xl184" colspan="2" style="height:15.0pt;mso-ignore:colspan">Billing to:</td>
          <td class="xl186" width="64" style="width:48pt">&nbsp;</td>
          <td class="xl186" width="64" style="width:48pt">&nbsp;</td>
          <td class="xl186" width="64" style="width:48pt">&nbsp;</td>
          <td class="xl187" width="64" style="border-top:none;width:48pt">&nbsp;</td>
          <td class="xl188" style="border-left:none">&nbsp;</td>
          <td class="xl189" style="border-top:none">TOTAL:</td>
          <td colspan="2" class="xl190" style="border-right:1.0pt solid black;border-left:
  none">55.06</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td colspan="6" rowspan="6" height="119" class="xl192" width="384" style="border-right:
  1.0pt solid black;border-bottom:1.0pt solid black;height:89.4pt;width:288pt">&nbsp;</td>
          <td class="xl124" style="border-left:none">&nbsp;</td>
          <td class="xl195">VAT</td>
          <td class="xl196" style="border-left:none">0%</td>
          <td class="xl197" style="border-top:none">0.00</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td height="20" class="xl188" style="height:15.0pt;border-top:none;border-left:
  none">&nbsp;</td>
          <td class="xl189" style="border-top:none">TOTAL:</td>
          <td colspan="2" class="xl190" style="border-right:1.0pt solid black;border-left:
  none">55.06</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td colspan="2" height="20" class="xl198" style="border-right:1.0pt solid black;
  height:15.0pt">TOTAL MDL</td>
          <td colspan="2" class="xl200" style="border-right:1.0pt solid black;border-left:
  none">1065.30</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td colspan="2" height="20" class="xl202" style="border-right:1.0pt solid black;
  height:15.0pt">EUR to MDL rate</td>
          <td colspan="2" class="xl203" style="border-right:1.0pt solid black;border-left:
  none">Issue date</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td rowspan="2" height="39" class="xl204" style="border-bottom:1.0pt solid black;
  height:29.4pt;border-top:none">1 EUR =</td>
          <td rowspan="2" class="xl205" style="border-bottom:1.0pt solid black;border-top:
  none">19.3462</td>
          <td colspan="2" rowspan="2" class="xl206" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black">24-Feb-24</td>
        </tr>
        <tr height="20" style="height:15.0pt"></tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl184" style="height:14.4pt;border-top:none">Remarks:</td>
          <td colspan="9" rowspan="3" class="xl215" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black">&nbsp;</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl218" style="height:14.4pt">&nbsp;</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td height="20" class="xl218" style="height:15.0pt">&nbsp;</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl184" colspan="4" style="height:14.4pt;mso-ignore:colspan">Name and signature of handling agent</td>
          <td class="xl223" style="border-top:none">&nbsp;</td>
          <td class="xl224" colspan="5" style="mso-ignore:colspan;border-right:1.0pt solid black">Name and signature of Crew/Carrier representativ <span style="display:none">e</span>
          </td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td colspan="5" height="19" class="xl225" style="border-right:1.0pt solid black;
  height:14.4pt">&nbsp;</td>
          <td class="xl218" style="border-left:none">&nbsp;</td>
          <td class="xl66"></td>
          <td class="xl66"></td>
          <td class="xl66"></td>
          <td class="xl227">&nbsp;</td>
        </tr>
        <tr height="19" style="height:14.4pt">
          <td height="19" class="xl228" style="height:14.4pt">&nbsp;</td>
          <td class="xl66"></td>
          <td class="xl66"></td>
          <td class="xl66"></td>
          <td class="xl227">&nbsp;</td>
          <td class="xl218" style="border-left:none">&nbsp;</td>
          <td class="xl66"></td>
          <td class="xl66"></td>
          <td class="xl66"></td>
          <td class="xl227">&nbsp;</td>
        </tr>
        <tr height="20" style="height:15.0pt">
          <td height="20" class="xl229" style="height:15.0pt">&nbsp;</td>
          <td class="xl230">&nbsp;</td>
          <td class="xl230">&nbsp;</td>
          <td class="xl230">&nbsp;</td>
          <td class="xl231">&nbsp;</td>
          <td class="xl232" style="border-left:none">&nbsp;</td>
          <td class="xl230">&nbsp;</td>
          <td class="xl230">&nbsp;</td>
          <td class="xl230">&nbsp;</td>
          <td class="xl231">&nbsp;</td>
        </tr>
      </tbody>
    </table>
  
</body></html>`;
}
