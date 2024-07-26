import { GeneralConfigState } from "@/models/Config";
import { IFlight } from "@/models/Flight";
import { realmWithoutSync } from "@/realm";
import dayjs from "dayjs";
import { formatTime } from "./formatTime";
import { IServiceCategory } from "@/models/ServiceCategory";

export default function reampChecklistHTML(flight: IFlight) {
	const [config] = realmWithoutSync.objects<GeneralConfigState>("General");

	let serviceCategories = realmWithoutSync.objects<IServiceCategory>("ServiceCategory");
	const parsedRoute = flight?.handlingType === 'FULL' ? `${flight?.arrival.from}-${config.defaultAirport}-${flight?.departure.to}` :
		flight?.handlingType === 'Departure' ? `${config.defaultAirport}-${flight?.departure.to}` : `${flight?.arrival.from}-${config.defaultAirport}`

	const depPaxCount = flight?.handlingType != 'Arrival' ? flight?.departure.adultCount + flight?.departure.minorCount : 0
	const arrPaxCount = flight?.handlingType != 'Departure' ? flight?.arrival.adultCount + flight?.arrival.minorCount : 0



	const renderCategoryRow = (serviceCategoryName = '') => `<tr height="20" style="height:15.0pt">
  <td colspan="3" height="20" class="xl118" width="204" style="border-right:.5pt solid black;
  height:15.0pt;width:152pt">${serviceCategoryName}</td>
  <td colspan="2" class="xl106" width="128" style="border-right:.5pt solid black;
  border-left:none;width:96pt">&nbsp;</td>
  <td colspan="4" class="xl119" width="256" style="border-right:1.0pt solid black;
  width:192pt">&nbsp;</td>
 </tr>`

	const renderServiceRow = (serviceName: string = '', count?: number, notes?: string) => ` <tr height="20" style="height:15.0pt">
  <td colspan="3" height="20" class="xl120" width="204" style="border-right:.5pt solid black;
  height:15.0pt;width:152pt">${serviceName}</td>
  <td colspan="2" class="xl112" width="128" style="border-right:.5pt solid black;
  border-left:none;width:96pt">${count ? count : `&nbsp;`}</td>
  <td colspan="4" class="xl110" width="256" style="border-right:1.0pt solid black;
  width:192pt">${notes ? notes : `&nbsp;`}</td>
 </tr>
 `

	const renderServices = () => {

		let resultHTML = '';
		serviceCategories.map(category => {

			resultHTML += renderCategoryRow(category.categoryName)

			category.services.map(service => {

				flight?.providedServices?.otherServices?.forEach(s => {
					if (s.service.serviceName === service.serviceName) {
						resultHTML += renderServiceRow(service.serviceName, s?.isUsed ? s.quantity : 0, s.notes)
					}
				})


			})
		})

		resultHTML += renderCategoryRow('VIP');

		const v = flight?.providedServices?.VIPLoungeServices
		resultHTML += renderServiceRow('VIP / Express terminal', (v!.arrivalAdultPax + v!.arrivalMinorPax + v!.departureAdultPax + v!.departureMinorPax), v?.remarks)


		return resultHTML;

	}

	const renderSupportServices = () => {

		const fueling = !!(flight?.providedServices?.supportServices?.fuel?.fuelLitersQuantity) || '&nbsp;'
		const hotac = !!flight?.providedServices?.supportServices?.HOTAC?.total || '&nbsp;'
		const catering = !!flight?.providedServices?.supportServices?.catering?.total || '&nbsp;'
		const airportFees = !!flight?.providedServices?.supportServices?.airportFee?.total || '&nbsp;'

		return `<tr height="20" style="height:15.0pt">
  <td colspan="3" height="20" class="xl135" width="204" style="border-right:.5pt solid black;
  height:15.0pt;width:152pt">Support Services</td>
  <td colspan="2" class="xl106" width="128" style="border-left:none;width:96pt">&nbsp;</td>
  <td colspan="4" class="xl136" width="256" style="border-right:1.0pt solid black;
  width:192pt">&nbsp;</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td colspan="3" height="20" class="xl137" width="204" style="border-right:.5pt solid black;
  height:15.0pt;width:152pt">Fueling</td>
  <td colspan="2" class="xl112" width="128" style="border-right:.5pt solid black;
  border-left:none;width:96pt">${fueling === true ? 1 : fueling}</td>
  <td colspan="4" class="xl127" width="256" style="border-right:1.0pt solid black;
  border-left:none;width:192pt">&nbsp;</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td colspan="3" height="20" class="xl137" width="204" style="border-right:.5pt solid black;
  height:15.0pt;width:152pt">Catering</td>
  <td colspan="2" class="xl127" width="128" style="border-left:none;width:96pt">${catering === true ? 1 : catering}</td>
  <td colspan="4" class="xl127" width="256" style="border-right:1.0pt solid black;
  width:192pt">&nbsp;</td>
 </tr>
 <tr height="21" style="height:15.6pt">
  <td colspan="3" height="21" class="xl137" width="204" style="border-right:.5pt solid black;
  height:15.6pt;width:152pt">Airport fees</td>
  <td colspan="2" class="xl127" width="128" style="border-right:.5pt solid black;
  border-left:none;width:96pt">${airportFees === true ? 1 : airportFees}</td>
  <td colspan="4" class="xl127" width="256" style="border-right:1.0pt solid black;
  border-left:none;width:192pt">&nbsp;</td>
 </tr>
  <tr height="21" style="height:15.6pt">
  <td colspan="3" height="21" class="xl137" width="204" style="border-right:.5pt solid black;
  height:15.6pt;width:152pt">HOTAC</td>
  <td colspan="2" class="xl127" width="128" style="border-right:.5pt solid black;
  border-left:none;width:96pt">${hotac === true ? 1 : hotac}</td>
  <td colspan="4" class="xl127" width="256" style="border-right:1.0pt solid black;
  border-left:none;width:192pt">&nbsp;</td>
 </tr>`

	}
	return `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta name="ProgId" content="Excel.Sheet">
<meta name="Generator" content="Microsoft Excel 15">
<link id="Main-File" rel="Main-File" href="../Ramp%20check.htm">
<link rel="File-List" href="filelist.xml">
<link rel="Stylesheet" href="stylesheet.css">
<style>
<!--table
	{mso-displayed-decimal-separator:"\.";
	mso-displayed-thousand-separator:"\,";}
@page
	{margin:.75in .7in .75in .7in;
	mso-header-margin:.3in;
	mso-footer-margin:.3in;}
-->
</style>
<script language="JavaScript">
<!--
function fnUpdateTabs()
 {
  if (parent.window.g_iIEVer>=4) {
   if (parent.document.readyState=="complete"
    && parent.frames['frTabs'].document.readyState=="complete")
   parent.fnSetActiveSheet(0);
  else
   window.setTimeout("fnUpdateTabs();",150);
 }


if (window.name!="frSheet")
 window.location.replace("../Ramp%20check.htm");
else
 fnUpdateTabs();
//-->
</script>
<!--[endif]-->
<style>
tr
	{mso-height-source:auto;}
col
	{mso-width-source:auto;}
br
	{mso-data-placement:same-cell;}
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
	white-space:normal;
	mso-rotate:0;}
.xl65
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;}
.xl66
	{mso-style-parent:style0;
	font-weight:700;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;}
.xl67
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl68
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid black;
	border-right:1.0pt solid black;
	border-bottom:.5pt solid black;
	border-left:none;
	white-space:normal;}
.xl69
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl70
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:none;
	border-left:none;
	white-space:normal;}
.xl71
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid black;
	border-right:.5pt solid black;
	border-bottom:none;
	border-left:none;
	white-space:normal;}
.xl72
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:none;
	border-left:none;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl73
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid black;
	border-right:1.0pt solid black;
	border-bottom:none;
	border-left:none;
	white-space:normal;}
.xl74
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl75
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:1.0pt solid black;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl76
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl77
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl78
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl79
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:.5pt solid black;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl80
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl81
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl82
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid black;
	border-right:.5pt solid black;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl83
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl84
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid black;
	border-right:1.0pt solid black;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl85
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl86
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid black;
	border-right:1.0pt solid black;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl87
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl88
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:1.0pt solid black;
	border-bottom:none;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl89
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:1.0pt solid black;
	border-bottom:.5pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl90
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:"Medium Date";
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl91
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:"Short Time";
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:1.0pt solid black;
	border-bottom:1.0pt solid black;
	border-left:.5pt solid black;
	white-space:normal;}
.xl92
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	mso-number-format:"Medium Date";
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl93
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:1.0pt solid black;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl94
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid black;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;
	mso-text-control:shrinktofit;}
.xl95
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:none;
	white-space:normal;}
.xl96
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl97
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:1.0pt solid black;
	border-bottom:none;
	border-left:none;
	white-space:normal;}
.xl98
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl99
	{mso-style-parent:style0;
	white-space:normal;}
.xl100
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl101
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid black;
	border-right:1.0pt solid black;
	border-bottom:none;
	border-left:none;
	white-space:normal;}
.xl102
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:.5pt solid black;
	white-space:normal;}
.xl103
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl104
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl105
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:1.0pt solid black;
	border-right:.5pt solid black;
	border-bottom:.5pt solid black;
	border-left:none;
	white-space:normal;}
.xl106
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:.5pt solid black;
	white-space:normal;}
.xl107
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl108
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-style:italic;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:none;
	white-space:normal;}
.xl109
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid black;
	border-right:.5pt solid black;
	border-bottom:.5pt solid black;
	border-left:none;
	white-space:normal;}
.xl110
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:none;
	white-space:normal;}
.xl111
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:none;
	white-space:normal;}
.xl112
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:.5pt solid black;
	white-space:normal;}
.xl113
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid black;
	border-right:1.0pt solid black;
	border-bottom:.5pt solid black;
	border-left:none;
	white-space:normal;}
.xl114
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-style:italic;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:none;
	white-space:normal;}
.xl115
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl116
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-style:italic;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl117
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl118
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl119
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:none;
	white-space:normal;}
.xl120
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl121
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl122
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl123
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid black;
	border-right:.5pt solid black;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl124
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:.5pt solid black;
	white-space:normal;}
.xl125
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:none;
	border-left:none;
	white-space:normal;}
.xl126
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	white-space:normal;}
.xl127
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:none;
	border-left:.5pt solid black;
	white-space:normal;}
.xl128
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:none;
	border-left:none;
	white-space:normal;}
.xl129
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:.5pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl130
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:none;
	white-space:normal;}
.xl131
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:.5pt solid black;
	white-space:normal;}
.xl132
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:.5pt solid black;
	border-right:.5pt solid black;
	border-bottom:none;
	border-left:none;
	white-space:normal;}
.xl133
	{mso-style-parent:style0;
	color:windowtext;
	font-family:Calibri;
	mso-generic-font-family:auto;
	mso-font-charset:0;
	border-top:none;
	border-right:.5pt solid black;
	border-bottom:none;
	border-left:none;
	white-space:normal;}
.xl134
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid black;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl135
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-weight:700;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl136
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid black;
	border-right:none;
	border-bottom:none;
	border-left:.5pt solid black;
	white-space:normal;}
.xl137
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid black;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl138
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid black;
	white-space:normal;}
.xl139
	{mso-style-parent:style0;
	font-size:10.0pt;
	font-family:"Open Sans";
	mso-generic-font-family:auto;
	mso-font-charset:0;
	text-align:center;
	vertical-align:top;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid black;
	white-space:normal;}


</style>
</head>

<body link="#0563C1" vlink="#954F72">

<table border="0" cellpadding="0" cellspacing="0" width="588" style="border-collapse:
 collapse;table-layout:fixed;width:640pt">
 <colgroup><col width="70" style="mso-width-source:userset;mso-width-alt:2474;width:52pt">
 <col width="64" style="width:48pt">
 <col width="70" style="mso-width-source:userset;mso-width-alt:2474;width:52pt">
 <col width="64" span="6" style="width:48pt">
 </colgroup><tbody><tr height="20" style="height:15.0pt">
  <td height="20" class="xl65" width="70" style="height:15.0pt;width:52pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl65" width="70" style="width:52pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td class="xl65" width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt" align="left" valign="top"><span style="mso-ignore:vglayout;
  position:absolute;z-index:1;margin-left:1px;margin-top:5px;width:83px;
  height:51px"><img width="83" height="50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIMAAABNCAMAAACyoSeQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALcUExURf////Hx8djY2NLS0qCgoIODg8PDw9TU1P7+/ujo6MjIyG9vb0RERAwMDAAAAAICAmNjY7+/v/z8/PT09MbGxpGRkVBQUDAwMBYWFgkJCY6Ojs/Pz21tbYyMjPr6+tnZ2cDAwIuLi01NTRoaGg0NDQEBAYGBgXR0dHBwcKysrICAgEpKShwcHFFRUa6urtXV1QsLC3d3d+/v79vb22dnZzg4OB0dHQUFBWRkZLq6uvj4+FxcXFRUVOXl5efn58fHx6WlpWVlZSkpKQoKChERETExMU9PT39/f7u7u/Dw8KGhoTo6OuPj47m5uYWFhVhYWDQ0NAgICDw8PGhoaJKSksLCwurq6t/f3yQkJDY2NvX19eDg4H5+fj8/PyYmJg4ODh8fHzk5OXx8fLOzs9bW1u3t7UZGRmJiYqioqHl5eRMTExAQEF9fX7W1tezs7FpaWkFBQUlJSS4uLkdHR3V1daSkpMXFxenp6RISEhUVFSsrK1NTU4KCguLi4qqqqiIiIi0tLXJycpiYmObm5ri4uLe3t+Hh4fPz8/b29tfX15SUlJWVlZOTk5eXl93d3ZCQkJaWlt7e3v39/YqKiqampiMjI0tLS9zc3BQUFDU1Nc7OzsTExDIyMtra2iwsLKOjowMDAwYGBqurq15eXhcXFxgYGNDQ0O7u7sHBwT09PRkZGSgoKGxsbA8PD83NzUNDQ/n5+SAgIISEhLGxsaKiop2dnUVFRczMzLy8vHt7e/f3956enmlpaSEhIWBgYCcnJzMzMz4+PsnJyZubm4aGhp+fn8rKygQEBE5OTh4eHpqamhsbG+Tk5FdXVzs7O3h4eNHR0dPT07S0tLa2tr6+vn19fYiIiCoqKuvr642Njfv7+zc3Ny8vL0xMTPLy8mpqaqmpqW5ubiUlJaenp2ZmZltbW6+vr7CwsK2trYeHh5ycnLKyspmZmVlZWWFhYVJSUo+Pj3Fxcb29vQAAAMuq2HYAAAD0dFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wAY4PcXAAAACXBIWXMAABcRAAAXEQHKJvM/AAAERElEQVRoQ+2Zy7HsKAxACYByLuy9ZEFUkAFpKAS2REEEXhLECJDlH3bbU327pmp82n7PmL8khPAVLy8v/x98sCp4SvweCHaSQ2U09O6nmCydbgOoZHr/HfyU6KkP+JDkuvuKotzvMA3DRI9HvFXH/r+vC49t9mYF3k6x0/+gp+9bw4jtjkCJBoQ8udbjBh1l+hNztKX1yOsNTBpj7XFHnFLYDvV7+DrjMgjwRsXe/F1M5m+dAlrlEOXYNz8dx2T+avoLZpxGKXvyl8r+mfh3jMf5a4fW96PuK1ZurMBJlQNl/Q5Aa1z45fRfXl5eXnqAR89cr5oMKR9/JVboZpRfDSTM+s3ql+ydOMPg9lT3SdkGkeo+tWMCAd1gqlDicH+aq21t9poSslSocC9wGnDfDL2AtuDK4P1Zbsv+QI0fCzQGHpPWeNVb67J3G1eh3BJTNFoAHPDQs6pBZRB3Qxtzn7UftI+5kxh8IDat0Pmu0zaXR5ah3gm85zZ1kxlQsqq5Awv9/CSEhcoBoeLumEMLoxHZ0pmSZ0dIQ9mz6npYloK8sywWU6PDlaIkqeYAr5tzGSe2hpvHUJ43zWtWTWzJA7P5nJraQz0UeBnsTZKiyf1hhvNPllxgT7Gc1T4xV6FlfPQC28l8MsnFxd3/HABzm3TMZdUwW7tgb9JdNrA4lwdfRQLVmducTZJx7f0M5/dM8t/oAWHZ0bjZW2Rid7xgj9YxB8t6xP3lATsvyd5irMkDvHORN1kBLKIneijsTLJ8hal88pIHi/OzBNHJ06ubnHrJEw/EJrnPX1zj7hvOZ9gkaV471RyYzWe/IbNZ6RMBXsB1yQvMqjnzkrMP3Pa0uManeiiwEmktsbdoyQMk8a2jXjbqJ3oA70sMGdiUSRW8KU5Yol2lZMtEZpPd+M4lhFLYJtVpXA3JxOhiZI8yx5KLSWKuo190y1Ijk9xqggc+rOpg63hfaWbrDTUvNNbrhmXW1Xz2y59t6oC+8pZsBjhjmZaSi2RWrFrC/DjtG+4PvHAZzqqxoewm/gdrba6/zUW5iLGdL0OmllpXmK/rRXI1wJeXl/8Gq3V6vWQfLOhna98mdCU5Qf3XGmFUNiJbkbzPCV0oPuKFpwyVqz/zGcoX9JwFZCVCECkrK2zGXpXBQsKA37m+T4Absbitf5qLxSu7cnBwY8AoxmAaMD06UF4MeCNJW4x/QWLeNGQLXhs3ihE3e8D3cvBWKA2Pwgg/1O0i4jECYvncUndJlzP6+jSUNMpBT2VAZaoYacmMZZXEncxKLTGYBplECZ9AG1ARN8Bpspe71Z7gDG76yuB0vcPhhJhw15d2woklvIs8hEbZZNdOfTKZCGHKWDgHrJWlxcO1Vh6sg5BNEYZKZ3FYFx8MKtALbwSUR3zAvvAJO8TXuCPhXf6ABMZUAQePgi4VUHD1/1q0VAUsBqVse/Xy8vJyHyH+ARKef7ZwZAAnAAAAAElFTkSuQmCC" alt="" v:shapes="Picture_x0020_2"></span><!--[endif]--><span style="mso-ignore:vglayout2">
  <table cellpadding="0" cellspacing="0">
   <tbody><tr>
    <td height="20" class="xl65" width="64" style="height:15.0pt;width:48pt"></td>
   </tr>
  </tbody></table>
  </span></td>
  <td class="xl65" width="64" style="width:48pt"></td>
 </tr>
 <tr height="21" style="height:15.6pt">
  <td height="21" class="xl65" style="height:15.6pt"></td>
  <td class="xl65"></td>
  <td colspan="5" class="xl66">RAMP AGENT CHECKLIST</td>
  <td class="xl65"></td>
  <td class="xl65"></td>
 </tr>
 <tr height="21" style="height:15.6pt">
  <td height="21" class="xl65" style="height:15.6pt"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="2" height="19" class="xl67" width="134" style="border-right:1.0pt solid black;
  height:14.4pt;width:100pt">OPERATOR NAME:</td>
  <td colspan="2" class="xl67" width="134" style="border-right:1.0pt solid black;
  border-left:none;width:100pt">FLT NO.:</td>
  <td colspan="3" rowspan="2" class="xl69" width="192" style="border-right:.5pt solid black;
  border-bottom:1.0pt solid black;width:144pt">SCHEDULED / NON-SCHEDULED /
  OTHER</td>
  <td colspan="2" rowspan="2" class="xl72" width="128" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black;width:96pt">${flight?.scheduleType}</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td colspan="2" height="20" class="xl74" width="134" style="border-right:1.0pt solid black;
  height:15.0pt;width:100pt">${flight?.operatorName}.</td>
  <td colspan="2" class="xl76" width="134" style="border-right:1.0pt solid black;
  border-left:none;width:100pt">${flight?.flightNumber}</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td colspan="2" height="20" class="xl67" width="134" style="border-right:1.0pt solid black;
  height:15.0pt;width:100pt">ORDERING COMPANY NAME</td>
  <td colspan="2" class="xl69" width="134" style="border-right:1.0pt solid black;
  border-left:none;width:100pt">ROUTE:</td>
  <td colspan="3" class="xl80" width="192" style="border-right:.5pt solid black;
  border-left:none;width:144pt">ARR PAX (ADT/INF):</td>
  <td colspan="2" class="xl83" width="128" style="border-right:1.0pt solid black;
  width:96pt">${arrPaxCount}</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td colspan="2" height="20" class="xl85" width="134" style="border-right:1.0pt solid black;
  height:15.0pt;width:100pt">${flight?.orderingCompanyName}</td>
  <td colspan="2" class="xl87" width="134" style="border-right:1.0pt solid black;
  border-left:none;width:100pt">${parsedRoute}</td>
  <td colspan="3" class="xl80" width="192" style="border-right:.5pt solid black;
  border-left:none;width:144pt">DEP PAX (ADT/INF):</td>
  <td colspan="2" class="xl83" width="128" style="border-right:1.0pt solid black;
  width:96pt">${depPaxCount}</td>
 </tr>
 <tr height="40" style="height:30.0pt">
  <td colspan="2" height="40" class="xl67" width="134" style="border-right:1.0pt solid black;
  height:30.0pt;width:100pt">ARRIVAL DATE/TIME LT:</td>
  <td colspan="2" class="xl69" width="134" style="border-right:1.0pt solid black;
  border-left:none;width:100pt">DEPARTURE DATE/TIME LT</td>
  <td class="xl88" width="64" style="border-top:none;border-left:none;width:48pt">A/C
  TYPE:</td>
  <td class="xl89" width="64" style="border-top:none;border-left:none;width:48pt">A/C
  REG:</td>
  <td class="xl89" width="64" style="border-top:none;border-left:none;width:48pt">MTOW</td>
  <td colspan="2" class="xl69" width="128" style="border-right:1.0pt solid black;
  border-left:none;width:96pt">LVP IN FORCE</td>
 </tr>
 <tr height="21" style="height:15.6pt">
  <td height="21" class="xl90" width="70" style="height:15.6pt;width:52pt">${dayjs(flight?.arrival.arrivalDate).format('DD-MMM-YY')}</td>
  <td class="xl91" width="64" style="border-top:none;width:48pt">${formatTime(flight?.arrival.arrivalTime)}</td>
  <td class="xl92" width="70" style="border-left:none;width:52pt">${flight?.handlingType !== 'Arrival' ? dayjs(flight?.departure.departureDate).format('DD-MMM-YY') : '-'}</td>
  <td class="xl91" width="64" style="width:48pt">${flight?.handlingType !== 'Arrival' ? formatTime(flight?.departure.departureTime) : '-'}</td>
  <td class="xl93" width="64" style="border-left:none;width:48pt">${flight?.aircraftType}</td>
  <td class="xl94" width="64" style="border-left:none;width:48pt">${flight?.aircraftRegistration}</td>
  <td class="xl93" width="64" style="border-top:none;border-left:none;width:48pt">${flight?.mtow}</td>
  <td colspan="2" class="xl87" width="128" style="border-right:1.0pt solid black;
  border-left:none;width:96pt">NO</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="2" rowspan="2" height="38" class="xl69" width="134" style="border-right:
  1.0pt solid black;height:28.8pt;width:100pt">PARKING POSITION NO. :</td>
  <td colspan="5" class="xl67" width="326" style="border-right:1.0pt solid black;
  border-left:none;width:244pt">RAMP FOD INSPECTION BEFORE ARRIVAL PERFORMED</td>
  <td colspan="2" class="xl67" width="128" style="border-right:1.0pt solid black;
  border-left:none;width:96pt">FOD FOUND / NOT FOUND</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="5" rowspan="2" height="39" class="xl98" width="326" style="border-right:
  1.0pt solid black;border-bottom:1.0pt solid black;height:29.4pt;width:244pt">${!flight?.arrival?.rampInspectionBeforeArrival?.agent?.fullname ? '&nbsp;' : flight?.arrival?.rampInspectionBeforeArrival?.agent?.fullname}</td>
  <td colspan="2" rowspan="2" class="xl100" width="128" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black;width:96pt">${flight?.arrival?.rampInspectionBeforeArrival?.FOD === undefined ? '&nbsp;' : flight?.arrival?.rampInspectionBeforeArrival?.FOD ? 'FOD FOUND' : 'FOD NOT FOUND'}</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td colspan="2" rowspan="4" height="78" class="xl100" width="134" style="border-right:
  1.0pt solid black;border-bottom:1.0pt solid black;height:58.8pt;width:100pt">${flight?.parkingPosition}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="5" height="19" class="xl67" width="326" style="border-right:1.0pt solid black;
  height:14.4pt;border-left:none;width:244pt">RAMP FOD INSPECTION AFTER
  DEPARTURE PERFORMED</td>
  <td colspan="2" class="xl67" width="128" style="border-right:1.0pt solid black;
  border-left:none;width:96pt">FOD FOUND / NOT FOUND</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="5" rowspan="2" height="39" class="xl98" width="326" style="border-right:
  1.0pt solid black;border-bottom:1.0pt solid black;height:29.4pt;width:244pt">${!flight?.departure?.rampInspectionBeforeDeparture?.agent?.fullname ? '&nbsp;' : flight?.departure?.rampInspectionBeforeDeparture?.agent?.fullname}</td>
  <td colspan="2" rowspan="2" class="xl100" width="128" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black;width:96pt">${flight?.departure?.rampInspectionBeforeDeparture?.FOD === undefined ? '&nbsp;' : flight?.departure?.rampInspectionBeforeDeparture?.FOD ? 'FOD FOUND' : 'FOD NOT FOUND'}</td>
 </tr>
 <tr height="20" style="height:15.0pt">
 </tr>
 <tr height="20" style="height:15.0pt">
  <td colspan="3" height="20" class="xl80" width="204" style="border-right:.5pt solid black;
  height:15.0pt;width:152pt">PROVIDED SERVICES</td>
  <td colspan="2" class="xl102" width="128" style="border-right:.5pt solid black;
  border-left:none;width:96pt">OPERATIONS</td>
  <td colspan="4" class="xl103" width="256" style="border-right:1.0pt solid black;
  width:192pt">NOTES</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td colspan="3" height="20" class="xl104" width="204" style="border-right:.5pt solid black;
  height:15.0pt;width:152pt">Basic handling</td>
  <td colspan="2" class="xl106" width="128" style="border-right:.5pt solid black;
  border-left:none;width:96pt">1</td>
  <td colspan="4" class="xl106" width="256" style="border-right:1.0pt solid black;
  border-left:none;width:192pt">&nbsp;</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl107" width="70" style="height:15.0pt;border-top:none;
  width:52pt">&nbsp;</td>
  <td colspan="2" class="xl108" width="134" style="border-right:.5pt solid black;
  width:100pt">Marshalling</td>
  <td colspan="2" class="xl110" width="128" style="width:96pt">&nbsp;</td>
  <td colspan="4" class="xl112" width="256" style="border-right:1.0pt solid black;
  width:192pt">&nbsp;</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl107" width="70" style="height:15.0pt;border-top:none;
  width:52pt">&nbsp;</td>
  <td colspan="2" class="xl108" width="134" style="border-right:.5pt solid black;
  width:100pt">A/C wheels' chokes</td>
  <td colspan="2" class="xl110" width="128" style="border-right:.5pt solid black;
  width:96pt">&nbsp;</td>
  <td colspan="4" class="xl110" width="256" style="border-right:1.0pt solid black;
  width:192pt">&nbsp;</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl107" width="70" style="height:15.0pt;border-top:none;
  width:52pt">&nbsp;</td>
  <td colspan="2" class="xl114" width="134" style="border-right:.5pt solid black;
  width:100pt">Stand preparation</td>
  <td colspan="2" class="xl110" width="128" style="border-right:.5pt solid black;
  width:96pt">&nbsp;</td>
  <td colspan="4" class="xl110" width="256" style="border-right:1.0pt solid black;
  width:192pt">&nbsp;</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl107" width="70" style="height:15.0pt;border-top:none;
  width:52pt">&nbsp;</td>
  <td colspan="2" class="xl108" width="134" style="border-right:.5pt solid black;
  width:100pt">Apron transportation</td>
  <td colspan="2" class="xl110" width="128" style="border-right:.5pt solid black;
  width:96pt">&nbsp;</td>
  <td colspan="4" class="xl110" width="256" style="border-right:1.0pt solid black;
  width:192pt">&nbsp;</td>
 </tr>
 <tr height="21" style="height:15.6pt">
  <td height="21" class="xl115" width="70" style="height:15.6pt;width:52pt">&nbsp;</td>
  <td colspan="2" class="xl116" width="134" style="border-right:.5pt solid black;
  width:100pt">Safety cones</td>
  <td colspan="2" class="xl117" width="128" style="border-right:.5pt solid black;
  width:96pt">&nbsp;</td>
  <td colspan="4" class="xl117" width="256" style="border-right:1.0pt solid black;
  width:192pt">&nbsp;</td>
 </tr>
${renderServices()}
${renderSupportServices()}
 <tr height="19" style="height:14.4pt">
  <td colspan="9" height="19" class="xl135" width="588" style="border-right:1.0pt solid black;
  height:14.4pt;width:440pt">Remarks</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="9" rowspan="3" height="58" class="xl138" width="588" style="border-right:
  1.0pt solid black;border-bottom:1.0pt solid black;height:43.8pt;width:440pt">${flight?.providedServices?.remarks}</td>
 </tr>
 <tr height="19" style="height:14.4pt">
 </tr>
 <tr height="20" style="height:15.0pt">
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="5" height="19" class="xl135" width="332" style="border-right:1.0pt solid black;
  height:14.4pt;width:248pt">Name and Signature of Ramp Agent</td>
  <td colspan="4" class="xl135" width="256" style="border-right:1.0pt solid black;
  border-left:none;width:192pt">Name and Signature of Crew/Station Manager</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td colspan="5" rowspan="2" height="39" class="xl139" width="332" style="border-right:
  1.0pt solid black;border-bottom:1.0pt solid black;height:29.4pt;width:248pt"><img width="150" height="50" src="data:image/png;base64,${flight?.ramp?.signature
		}"></td>
  <td colspan="4" rowspan="2" class="xl139" width="256" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black;width:192pt"><img width="150" height="50" src="data:image/png;base64,${flight?.crew?.signature
		}"></td>
 </tr>
 <tr height="20" style="height:15.0pt">
 </tr>
 <!--[if supportMisalignedColumns]-->
 <tr height="0" style="display:none">
  <td width="70" style="width:52pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="70" style="width:52pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
  <td width="64" style="width:48pt"></td>
 </tr>
 <!--[endif]-->
</tbody></table>




</body></html>`
}