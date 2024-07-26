import { GeneralConfigState } from "@/models/Config";
import { IFlight } from "@/models/Flight";
import { realmWithoutSync } from "@/realm";
import { useQuery } from "@realm/react";
import dayjs from "dayjs";

export default function ArrDepTemplateRenderHTML(flight: IFlight, handlingType: any) {
	const [config] = realmWithoutSync.objects<GeneralConfigState>("General");
	const arrivalDate = dayjs(flight?.arrival.arrivalDate).format("DD-MMM-YY");
	const departureDate = dayjs(flight?.departure.departureDate).format(
		"DD-MMM-YY"
	);
	const {
		operatorName,
		aircraftRegistration,
		aircraftType,
		mtow,
		flightNumber,
		crew,
	} = flight;
	const arrivalRoute = `${flight?.arrival?.from}-${config.defaultAirport}`;
	const departureRoute = `${config.defaultAirport}-${flight?.departure?.to}`;
	const { departure, arrival } = flight;

	if (handlingType === "FULL")
		return `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta name="ProgId" content="Excel.Sheet">
<meta name="Generator" content="Microsoft Excel 15">

<style>
<!--table
	{mso-displayed-decimal-separator:"\.";
	mso-displayed-thousand-separator:"\,";}
@page
	{margin:.75in .7in .75in .7in;
	mso-header-margin:.3in;
	mso-footer-margin:.3in;}
-->
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
	white-space:nowrap;
	mso-rotate:0;}
.xl65
	{mso-style-parent:style0;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl66
	{mso-style-parent:style0;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;}
.xl67
	{mso-style-parent:style0;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl68
	{mso-style-parent:style0;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl69
	{mso-style-parent:style0;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl70
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;}
.xl71
	{mso-style-parent:style0;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl72
	{mso-style-parent:style0;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl73
	{mso-style-parent:style0;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl74
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl75
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl76
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl77
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl78
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:1.0pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl79
	{mso-style-parent:style0;
	mso-number-format:"Medium Date";
	text-align:center;
	border-top:none;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl80
	{mso-style-parent:style0;
	mso-number-format:"Medium Date";
	text-align:center;
	border-top:none;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl81
	{mso-style-parent:style0;
	mso-number-format:"Medium Date";
	text-align:center;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl82
	{mso-style-parent:style0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl83
	{mso-style-parent:style0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl84
	{mso-style-parent:style0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl85
	{mso-style-parent:style0;
	mso-number-format:"Medium Date";
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl86
	{mso-style-parent:style0;
	mso-number-format:"Medium Date";
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl87
	{mso-style-parent:style0;
	mso-number-format:"Medium Date";
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl88
	{mso-style-parent:style0;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl89
	{mso-style-parent:style0;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl90
	{mso-style-parent:style0;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl91
	{mso-style-parent:style0;
	mso-number-format:0%;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl92
	{mso-style-parent:style0;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;
	mso-protection:unlocked visible;}
.xl93
	{mso-style-parent:style0;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;
	mso-protection:unlocked visible;}
.xl94
	{mso-style-parent:style0;
	text-align:center;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;
	mso-protection:unlocked visible;}
.xl95
	{mso-style-parent:style0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl96
	{mso-style-parent:style0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl97
	{mso-style-parent:style0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl98
	{mso-style-parent:style0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl99
	{mso-style-parent:style0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl100
	{mso-style-parent:style0;
	text-align:left;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl101
	{mso-style-parent:style0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl102
	{mso-style-parent:style0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl103
	{mso-style-parent:style0;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl104
	{mso-style-parent:style0;
	font-weight:700;
	vertical-align:top;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl105
	{mso-style-parent:style0;
	font-weight:700;
	vertical-align:top;
	mso-protection:unlocked visible;}
.xl106
	{mso-style-parent:style0;
	font-weight:700;
	vertical-align:top;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;
	mso-protection:unlocked visible;}
.xl107
	{mso-style-parent:style0;
	font-weight:700;
	vertical-align:top;
	border-top:1.0pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl108
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:top;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;
	mso-protection:unlocked visible;}
.xl109
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:top;
	mso-protection:unlocked visible;}
.xl110
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:top;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;
	mso-protection:unlocked visible;}
.xl111
	{mso-style-parent:style0;
	text-align:left;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;word-wrap: break-word;
	mso-protection:unlocked visible;}
.xl112
	{mso-style-parent:style0;
	text-align:left;
	mso-protection:unlocked visible;}
.xl113
	{mso-style-parent:style0;
	text-align:left;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;
	mso-protection:unlocked visible;}
.xl114
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:top;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;
	mso-protection:unlocked visible;}
.xl115
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:top;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	mso-protection:unlocked visible;}
.xl116
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:top;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	mso-protection:unlocked visible;}
.xl117
	{mso-style-parent:style0;
	text-align:left;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;
	mso-protection:unlocked visible;}
.xl118
	{mso-style-parent:style0;
	text-align:left;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	mso-protection:unlocked visible;}
.xl119
	{mso-style-parent:style0;
	text-align:left;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;
	mso-protection:unlocked visible;}
.xl120
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl121
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl122
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl123
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl124
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;}
.xl125
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:.5pt solid windowtext;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl126
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:1.0pt solid windowtext;}
.xl127
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl128
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:1.0pt solid windowtext;}
.xl129
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:none;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}
.xl130
	{mso-style-parent:style0;
	font-weight:700;
	text-align:center;
	vertical-align:middle;
	border-top:none;
	border-right:1.0pt solid windowtext;
	border-bottom:1.0pt solid windowtext;
	border-left:none;}

td{
white-space:normal;
}
</style>

</head>

<body link="#0563C1" vlink="#954F72">

<table border="0" cellpadding="0" cellspacing="0" width="896" style="border-collapse:
 collapse;table-layout:fixed;width:772pt">
 <colgroup><col width="64" span="14" style="width:48pt">
 </colgroup><tbody><tr  style="height:14.4pt">
  <td  width="64" style="height:14.4pt;width:48pt;border-top: 1px solid black;
    border-left: 1px solid black;" align="left" valign="top"><span style="mso-ignore:vglayout;
  position:absolute;z-index:1;margin-left:5px;margin-top:0;width:84px;
  height:50px"><img width="80" height="50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIMAAABNCAMAAACyoSeQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALcUExURf////Hx8djY2NLS0qCgoIODg8PDw9TU1P7+/ujo6MjIyG9vb0RERAwMDAAAAAICAmNjY7+/v/z8/PT09MbGxpGRkVBQUDAwMBYWFgkJCY6Ojs/Pz21tbYyMjPr6+tnZ2cDAwIuLi01NTRoaGg0NDQEBAYGBgXR0dHBwcKysrICAgEpKShwcHFFRUa6urtXV1QsLC3d3d+/v79vb22dnZzg4OB0dHQUFBWRkZLq6uvj4+FxcXFRUVOXl5efn58fHx6WlpWVlZSkpKQoKChERETExMU9PT39/f7u7u/Dw8KGhoTo6OuPj47m5uYWFhVhYWDQ0NAgICDw8PGhoaJKSksLCwurq6t/f3yQkJDY2NvX19eDg4H5+fj8/PyYmJg4ODh8fHzk5OXx8fLOzs9bW1u3t7UZGRmJiYqioqHl5eRMTExAQEF9fX7W1tezs7FpaWkFBQUlJSS4uLkdHR3V1daSkpMXFxenp6RISEhUVFSsrK1NTU4KCguLi4qqqqiIiIi0tLXJycpiYmObm5ri4uLe3t+Hh4fPz8/b29tfX15SUlJWVlZOTk5eXl93d3ZCQkJaWlt7e3v39/YqKiqampiMjI0tLS9zc3BQUFDU1Nc7OzsTExDIyMtra2iwsLKOjowMDAwYGBqurq15eXhcXFxgYGNDQ0O7u7sHBwT09PRkZGSgoKGxsbA8PD83NzUNDQ/n5+SAgIISEhLGxsaKiop2dnUVFRczMzLy8vHt7e/f3956enmlpaSEhIWBgYCcnJzMzMz4+PsnJyZubm4aGhp+fn8rKygQEBE5OTh4eHpqamhsbG+Tk5FdXVzs7O3h4eNHR0dPT07S0tLa2tr6+vn19fYiIiCoqKuvr642Njfv7+zc3Ny8vL0xMTPLy8mpqaqmpqW5ubiUlJaenp2ZmZltbW6+vr7CwsK2trYeHh5ycnLKyspmZmVlZWWFhYVJSUo+Pj3Fxcb29vQAAAMuq2HYAAAD0dFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wAY4PcXAAAACXBIWXMAABcRAAAXEQHKJvM/AAAERElEQVRoQ+2Zy7HsKAxACYByLuy9ZEFUkAFpKAS2REEEXhLECJDlH3bbU327pmp82n7PmL8khPAVLy8v/x98sCp4SvweCHaSQ2U09O6nmCydbgOoZHr/HfyU6KkP+JDkuvuKotzvMA3DRI9HvFXH/r+vC49t9mYF3k6x0/+gp+9bw4jtjkCJBoQ8udbjBh1l+hNztKX1yOsNTBpj7XFHnFLYDvV7+DrjMgjwRsXe/F1M5m+dAlrlEOXYNz8dx2T+avoLZpxGKXvyl8r+mfh3jMf5a4fW96PuK1ZurMBJlQNl/Q5Aa1z45fRfXl5eXnqAR89cr5oMKR9/JVboZpRfDSTM+s3ql+ydOMPg9lT3SdkGkeo+tWMCAd1gqlDicH+aq21t9poSslSocC9wGnDfDL2AtuDK4P1Zbsv+QI0fCzQGHpPWeNVb67J3G1eh3BJTNFoAHPDQs6pBZRB3Qxtzn7UftI+5kxh8IDat0Pmu0zaXR5ah3gm85zZ1kxlQsqq5Awv9/CSEhcoBoeLumEMLoxHZ0pmSZ0dIQ9mz6npYloK8sywWU6PDlaIkqeYAr5tzGSe2hpvHUJ43zWtWTWzJA7P5nJraQz0UeBnsTZKiyf1hhvNPllxgT7Gc1T4xV6FlfPQC28l8MsnFxd3/HABzm3TMZdUwW7tgb9JdNrA4lwdfRQLVmducTZJx7f0M5/dM8t/oAWHZ0bjZW2Rid7xgj9YxB8t6xP3lATsvyd5irMkDvHORN1kBLKIneijsTLJ8hal88pIHi/OzBNHJ06ubnHrJEw/EJrnPX1zj7hvOZ9gkaV471RyYzWe/IbNZ6RMBXsB1yQvMqjnzkrMP3Pa0uManeiiwEmktsbdoyQMk8a2jXjbqJ3oA70sMGdiUSRW8KU5Yol2lZMtEZpPd+M4lhFLYJtVpXA3JxOhiZI8yx5KLSWKuo190y1Ijk9xqggc+rOpg63hfaWbrDTUvNNbrhmXW1Xz2y59t6oC+8pZsBjhjmZaSi2RWrFrC/DjtG+4PvHAZzqqxoewm/gdrba6/zUW5iLGdL0OmllpXmK/rRXI1wJeXl/8Gq3V6vWQfLOhna98mdCU5Qf3XGmFUNiJbkbzPCV0oPuKFpwyVqz/zGcoX9JwFZCVCECkrK2zGXpXBQsKA37m+T4Absbitf5qLxSu7cnBwY8AoxmAaMD06UF4MeCNJW4x/QWLeNGQLXhs3ihE3e8D3cvBWKA2Pwgg/1O0i4jECYvncUndJlzP6+jSUNMpBT2VAZaoYacmMZZXEncxKLTGYBplECZ9AG1ARN8Bpspe71Z7gDG76yuB0vcPhhJhw15d2woklvIs8hEbZZNdOfTKZCGHKWDgHrJWlxcO1Vh6sg5BNEYZKZ3FYFx8MKtALbwSUR3zAvvAJO8TXuCPhXf6ABMZUAQePgi4VUHD1/1q0VAUsBqVse/Xy8vJyHyH+ARKef7ZwZAAnAAAAAElFTkSuQmCC" alt="" v:shapes="Picture_x0020_1"></span><!--[endif]--></td>
  <td class="xl66" width="64" style="width:48pt">&nbsp;</td>
  <td class="xl66" width="64" style="width:48pt">&nbsp;</td>
  <td class="xl66" width="64" style="width:48pt">&nbsp;</td>
  <td class="xl66" width="64" style="width:48pt">&nbsp;</td>
  <td class="xl66" width="64" style="width:48pt">&nbsp;</td>
  <td class="xl67" width="64" style="width:48pt">&nbsp;</td>
  <td width="64" style="width:48pt;border-top: 1px solid black;
    border-left: 1px solid black; " align="left" valign="top"><span style="mso-ignore:vglayout;
  position:absolute;z-index:2;margin-left:5px;margin-top:0;width:83px;
  height:50px">
  <img width="83" height="50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIMAAABNCAMAAACyoSeQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALcUExURf////Hx8djY2NLS0qCgoIODg8PDw9TU1P7+/ujo6MjIyG9vb0RERAwMDAAAAAICAmNjY7+/v/z8/PT09MbGxpGRkVBQUDAwMBYWFgkJCY6Ojs/Pz21tbYyMjPr6+tnZ2cDAwIuLi01NTRoaGg0NDQEBAYGBgXR0dHBwcKysrICAgEpKShwcHFFRUa6urtXV1QsLC3d3d+/v79vb22dnZzg4OB0dHQUFBWRkZLq6uvj4+FxcXFRUVOXl5efn58fHx6WlpWVlZSkpKQoKChERETExMU9PT39/f7u7u/Dw8KGhoTo6OuPj47m5uYWFhVhYWDQ0NAgICDw8PGhoaJKSksLCwurq6t/f3yQkJDY2NvX19eDg4H5+fj8/PyYmJg4ODh8fHzk5OXx8fLOzs9bW1u3t7UZGRmJiYqioqHl5eRMTExAQEF9fX7W1tezs7FpaWkFBQUlJSS4uLkdHR3V1daSkpMXFxenp6RISEhUVFSsrK1NTU4KCguLi4qqqqiIiIi0tLXJycpiYmObm5ri4uLe3t+Hh4fPz8/b29tfX15SUlJWVlZOTk5eXl93d3ZCQkJaWlt7e3v39/YqKiqampiMjI0tLS9zc3BQUFDU1Nc7OzsTExDIyMtra2iwsLKOjowMDAwYGBqurq15eXhcXFxgYGNDQ0O7u7sHBwT09PRkZGSgoKGxsbA8PD83NzUNDQ/n5+SAgIISEhLGxsaKiop2dnUVFRczMzLy8vHt7e/f3956enmlpaSEhIWBgYCcnJzMzMz4+PsnJyZubm4aGhp+fn8rKygQEBE5OTh4eHpqamhsbG+Tk5FdXVzs7O3h4eNHR0dPT07S0tLa2tr6+vn19fYiIiCoqKuvr642Njfv7+zc3Ny8vL0xMTPLy8mpqaqmpqW5ubiUlJaenp2ZmZltbW6+vr7CwsK2trYeHh5ycnLKyspmZmVlZWWFhYVJSUo+Pj3Fxcb29vQAAAMuq2HYAAAD0dFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wAY4PcXAAAACXBIWXMAABcRAAAXEQHKJvM/AAAERElEQVRoQ+2Zy7HsKAxACYByLuy9ZEFUkAFpKAS2REEEXhLECJDlH3bbU327pmp82n7PmL8khPAVLy8v/x98sCp4SvweCHaSQ2U09O6nmCydbgOoZHr/HfyU6KkP+JDkuvuKotzvMA3DRI9HvFXH/r+vC49t9mYF3k6x0/+gp+9bw4jtjkCJBoQ8udbjBh1l+hNztKX1yOsNTBpj7XFHnFLYDvV7+DrjMgjwRsXe/F1M5m+dAlrlEOXYNz8dx2T+avoLZpxGKXvyl8r+mfh3jMf5a4fW96PuK1ZurMBJlQNl/Q5Aa1z45fRfXl5eXnqAR89cr5oMKR9/JVboZpRfDSTM+s3ql+ydOMPg9lT3SdkGkeo+tWMCAd1gqlDicH+aq21t9poSslSocC9wGnDfDL2AtuDK4P1Zbsv+QI0fCzQGHpPWeNVb67J3G1eh3BJTNFoAHPDQs6pBZRB3Qxtzn7UftI+5kxh8IDat0Pmu0zaXR5ah3gm85zZ1kxlQsqq5Awv9/CSEhcoBoeLumEMLoxHZ0pmSZ0dIQ9mz6npYloK8sywWU6PDlaIkqeYAr5tzGSe2hpvHUJ43zWtWTWzJA7P5nJraQz0UeBnsTZKiyf1hhvNPllxgT7Gc1T4xV6FlfPQC28l8MsnFxd3/HABzm3TMZdUwW7tgb9JdNrA4lwdfRQLVmducTZJx7f0M5/dM8t/oAWHZ0bjZW2Rid7xgj9YxB8t6xP3lATsvyd5irMkDvHORN1kBLKIneijsTLJ8hal88pIHi/OzBNHJ06ubnHrJEw/EJrnPX1zj7hvOZ9gkaV471RyYzWe/IbNZ6RMBXsB1yQvMqjnzkrMP3Pa0uManeiiwEmktsbdoyQMk8a2jXjbqJ3oA70sMGdiUSRW8KU5Yol2lZMtEZpPd+M4lhFLYJtVpXA3JxOhiZI8yx5KLSWKuo190y1Ijk9xqggc+rOpg63hfaWbrDTUvNNbrhmXW1Xz2y59t6oC+8pZsBjhjmZaSi2RWrFrC/DjtG+4PvHAZzqqxoewm/gdrba6/zUW5iLGdL0OmllpXmK/rRXI1wJeXl/8Gq3V6vWQfLOhna98mdCU5Qf3XGmFUNiJbkbzPCV0oPuKFpwyVqz/zGcoX9JwFZCVCECkrK2zGXpXBQsKA37m+T4Absbitf5qLxSu7cnBwY8AoxmAaMD06UF4MeCNJW4x/QWLeNGQLXhs3ihE3e8D3cvBWKA2Pwgg/1O0i4jECYvncUndJlzP6+jSUNMpBT2VAZaoYacmMZZXEncxKLTGYBplECZ9AG1ARN8Bpspe71Z7gDG76yuB0vcPhhJhw15d2woklvIs8hEbZZNdOfTKZCGHKWDgHrJWlxcO1Vh6sg5BNEYZKZ3FYFx8MKtALbwSUR3zAvvAJO8TXuCPhXf6ABMZUAQePgi4VUHD1/1q0VAUsBqVse/Xy8vJyHyH+ARKef7ZwZAAnAAAAAElFTkSuQmCC" alt="" v:shapes="Picture_x0020_2"></span></td>
  <td class="xl66" width="64" style="width:48pt">&nbsp;</td>
  <td class="xl66" width="64" style="width:48pt">&nbsp;</td>
  <td class="xl66" width="64" style="width:48pt">&nbsp;</td>
  <td class="xl66" width="64" style="width:48pt">&nbsp;</td>
  <td class="xl66" width="64" style="width:48pt">&nbsp;</td>
  <td class="xl67" width="64" style="width:48pt">&nbsp;</td>
 </tr>
 <tr  style="height:14.4pt">
  <td  class="xl68" style="height:14.4pt">&nbsp;</td>
  <td colspan="5" style="mso-ignore:colspan"></td>
  <td class="xl69">&nbsp;</td>
  <td class="xl68" style="border-left:none">&nbsp;</td>
  <td colspan="5" style="mso-ignore:colspan"></td>
  <td class="xl69">&nbsp;</td>
 </tr>
 <tr  style="height:14.4pt">
  <td  class="xl68" style="height:14.4pt">&nbsp;</td>
  <td></td>
  <td colspan="3" class="xl70">ARRIVAL INFORMATION</td>
  <td></td>
  <td class="xl69">&nbsp;</td>
  <td class="xl68" style="border-left:none">&nbsp;</td>
  <td></td>
  <td colspan="3" class="xl70">DEPARTURE INFORMATION</td>
  <td></td>
  <td class="xl69">&nbsp;</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl71" style="height:15.0pt">&nbsp;</td>
  <td class="xl72">&nbsp;</td>
  <td class="xl72">&nbsp;</td>
  <td class="xl72">&nbsp;</td>
  <td class="xl72">&nbsp;</td>
  <td class="xl72">&nbsp;</td>
  <td class="xl73">&nbsp;</td>
  <td class="xl68" style="border-left:none">&nbsp;</td>
  <td colspan="3" style="mso-ignore:colspan"></td>
  <td class="xl72">&nbsp;</td>
  <td class="xl72">&nbsp;</td>
  <td class="xl73">&nbsp;</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl74" style="border-right:.5pt solid black;
  height:14.4pt">NAME</td>
  <td colspan="3" class="xl77" style="border-right:1.0pt solid black;border-left:
  none">DATE</td>
  <td colspan="4" class="xl75" style="border-right:.5pt solid black">NAME</td>
  <td colspan="3" class="xl79" style="border-right:1.0pt solid black;border-left:
  none">DATE</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl82" style="border-right:.5pt solid black;
  height:14.4pt">DATE</td>
  <td colspan="3" class="xl85" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${arrivalDate}</td>
  <td colspan="4" class="xl82" style="border-right:.5pt solid black;border-left:
  none">DATE</td>
  <td colspan="3" class="xl85" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${departureDate}</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl82" style="border-right:.5pt solid black;
  height:14.4pt">FLIGHT NO.</td>
  <td colspan="3" class="xl90" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${flightNumber}</td>
  <td colspan="4" class="xl82" style="border-right:.5pt solid black;border-left:
  none">FLIGHT NO.</td>
  <td colspan="3" class="xl91" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${flightNumber}</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl82" style="border-right:.5pt solid black;
  height:14.4pt">OPERATOR</td>
  <td colspan="3" class="xl90" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${operatorName}</td>
  <td colspan="4" class="xl82" style="border-right:.5pt solid black;border-left:
  none">OPERATOR</td>
  <td colspan="3" class="xl92" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${operatorName}</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl82" style="border-right:.5pt solid black;
  height:14.4pt">ROUTE</td>
  <td colspan="3" class="xl92" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${arrivalRoute}</td>
  <td colspan="4" class="xl82" style="border-right:.5pt solid black;border-left:
  none">ROUTE</td>
  <td colspan="3" class="xl90" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${departureRoute}</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl82" style="border-right:.5pt solid black;
  height:14.4pt">A/C REG</td>
  <td colspan="3" class="xl90" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${aircraftRegistration}</td>
  <td colspan="4" class="xl82" style="border-right:.5pt solid black;border-left:
  none">A/C REG</td>
  <td colspan="3" class="xl90" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${aircraftRegistration}</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl82" style="border-right:.5pt solid black;
  height:14.4pt">A/C TYPE</td>
  <td colspan="3" class="xl90" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${aircraftType}</td>
  <td colspan="4" class="xl82" style="border-right:.5pt solid black;border-left:
  none">A/C TYPE</td>
  <td colspan="3" class="xl90" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${aircraftType}</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl82" style="border-right:.5pt solid black;
  height:14.4pt">MTOW (kg)</td>
  <td colspan="3" class="xl90" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${mtow}</td>
  <td colspan="4" class="xl82" style="border-right:.5pt solid black;border-left:
  none">MTOW (kg)</td>
  <td colspan="3" class="xl90" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${mtow}</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl82" style="border-right:.5pt solid black;
  height:14.4pt">CREW No.</td>
  <td colspan="3" class="xl90" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${arrival?.crewNumber}</td>
  <td colspan="4" class="xl82" style="border-right:.5pt solid black;border-left:
  none">CREW No.</td>
  <td colspan="3" class="xl92" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${departure?.crewNumber}</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl82" style="border-right:.5pt solid black;
  height:14.4pt">PAX No.</td>
  <td colspan="3" class="xl92" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${Number(arrival?.adultCount) + Number(arrival?.minorCount)
			}</td>
  <td colspan="4" class="xl82" style="border-right:.5pt solid black;border-left:
  none">PAX No.</td>
  <td colspan="3" class="xl92" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${Number(departure?.adultCount) + Number(departure?.minorCount)
			}</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl82" style="border-right:.5pt solid black;
  height:14.4pt">CARGO</td>
  <td colspan="3" class="xl92" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${arrival?.cargoInfo}</td>
  <td colspan="4" class="xl82" style="border-right:.5pt solid black;border-left:
  none">CARGO</td>
  <td colspan="3" class="xl92" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${departure?.cargoInfo}</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="4"  class="xl82" style="border-right:.5pt solid black;
  height:14.4pt">MAIL</td>
  <td colspan="3" class="xl92" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${arrival?.mailInfo}</td>
  <td colspan="4" class="xl82" style="border-right:.5pt solid black;border-left:
  none;">MAIL</td>
  <td colspan="3" class="xl95" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap">${departure?.mailInfo}</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td colspan="4" height="20" class="xl98" style="border-right:.5pt solid black;
  height:15.0pt">SPECIAL</td>
  <td colspan="3" class="xl101" style="border-right:1.0pt solid black;border-left:
  none;text-wrap:wrap;">${arrival?.specialInfo}</td>
  <td colspan="4" class="xl98" style="border-left:none">SPECIAL</td>
  <td colspan="3" class="xl101" style="border-right:1.0pt solid black;text-wrap:wrap;">${departure?.specialInfo
			}</td>
 </tr>
 <tr  style="height:14.4pt">
  <td  class="xl104" style="height:14.4pt">REMARKS</td>
  <td class="xl105"></td>
  <td class="xl105"></td>
  <td class="xl105"></td>
  <td class="xl105"></td>
  <td class="xl105"></td>
  <td class="xl106">&nbsp;</td>
  <td class="xl107" style="border-top:none;border-left:none">REMARKS</td>
  <td class="xl105"></td>
  <td class="xl105"></td>
  <td class="xl105"></td>
  <td class="xl105"></td>
  <td class="xl105"></td>
  <td class="xl106">&nbsp;</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="7" rowspan="6" class="xl111" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black;vertical-align:top;text-wrap:wrap;">${arrival?.remarksInfo
			}<div style="max-width:100%"></div></td>
  <td colspan="7" rowspan="6" class="xl111" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black;vertical-align:top;text-wrap:wrap;">${departure?.remarksInfo
			}</td>
 </tr>
 <tr  style="height:14.4pt">
 </tr>
 <tr  style="height:14.4pt">
 </tr>
 <tr  style="height:14.4pt">
 </tr>
 <tr  style="height:14.4pt">
 </tr>
 <tr height="20" style="height:15.0pt">
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="7"  class="xl120" style="border-right:1.0pt solid black;
  height:14.4pt">PILOT IN COMMAND</td>
  <td colspan="7" class="xl120" style="border-right:1.0pt solid black;border-left:
  none">PILOT IN COMMAND</td>
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="3" rowspan="2" height="38" class="xl123" style="border-bottom:.5pt solid black;
  height:28.8pt">NAME<span style="mso-spacerun:yes">   </span></td>
  <td colspan="4" rowspan="2" class="xl124" style="border-right:1.0pt solid black;
  border-bottom:.5pt solid black">${crew?.name}</td>
  <td colspan="3" rowspan="2" class="xl123" style="border-bottom:.5pt solid black">NAME<span style="mso-spacerun:yes">   </span></td>
  <td colspan="4" rowspan="2" class="xl124" style="border-right:1.0pt solid black;
  border-bottom:.5pt solid black">${crew?.name}</td>
 </tr>
 <tr  style="height:14.4pt">
 </tr>
 <tr  style="height:14.4pt">
  <td colspan="2" rowspan="4" height="77" class="xl123" style="border-bottom:1.0pt solid black;
  height:58.2pt">SIGNATURE</td>
  <td colspan="5" rowspan="4" class="xl124" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black"><img width="150" height="50" src="data:image/png;base64,${flight?.crew?.signature
			}"></td>
  <td colspan="2" rowspan="4" class="xl123" style="border-bottom:1.0pt solid black">SIGNATURE</td>
  <td colspan="5" rowspan="4" class="xl124" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black"><img width="150" height="50" src="data:image/png;base64,${flight?.crew?.signature
			}"></td>
 </tr>
 <tr  style="height:14.4pt">
 </tr>
 <tr  style="height:14.4pt">
 </tr>
 <tr height="20" style="height:15.0pt">
 </tr>
 
 
 
</tbody></table>



</body></html>
`;

	return `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head>
  <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
  <meta name="ProgId" content="Excel.Sheet">
  <meta name="Generator" content="Microsoft Excel 15">
  <style>
  <!--table
  	{mso-displayed-decimal-separator:"\.";
  	mso-displayed-thousand-separator:"\,";}
  @page
  	{margin:.3in .3in .33in .3in;
  	mso-header-margin:.3in;
  	mso-footer-margin:.3in;}
  -->

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
  	white-space:nowrap;
  	mso-rotate:0;}
  .xl65
  	{mso-style-parent:style0;
  	border-top:none;
  	border-right:none;
  	border-bottom:none;
  	border-left:1.0pt solid windowtext;}
  .xl66
  	{mso-style-parent:style0;
  	border-top:none;
  	border-right:none;
  	border-bottom:1.0pt solid windowtext;
  	border-left:none;}
  .xl67
  	{mso-style-parent:style0;
  	border-top:none;
  	border-right:1.0pt solid windowtext;
  	border-bottom:1.0pt solid windowtext;
  	border-left:none;}
  .xl68
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:1.0pt solid windowtext;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl69
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:1.0pt solid windowtext;
  	border-right:.5pt solid windowtext;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl70
  	{mso-style-parent:style0;
  	mso-number-format:"Medium Date";
  	text-align:center;
  	border-top:none;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:.5pt solid windowtext;}
  .xl71
  	{mso-style-parent:style0;
  	mso-number-format:"Medium Date";
  	text-align:center;
  	border-top:none;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl72
  	{mso-style-parent:style0;
  	mso-number-format:"Medium Date";
  	text-align:center;
  	border-top:none;
  	border-right:1.0pt solid windowtext;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl73
  	{mso-style-parent:style0;
  	text-align:left;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:1.0pt solid windowtext;}
  .xl74
  	{mso-style-parent:style0;
  	text-align:left;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl75
  	{mso-style-parent:style0;
  	text-align:left;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:.5pt solid windowtext;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl76
  	{mso-style-parent:style0;
  	mso-number-format:"Medium Date";
  	text-align:center;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:.5pt solid windowtext;}
  .xl77
  	{mso-style-parent:style0;
  	text-align:center;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl78
  	{mso-style-parent:style0;
  	text-align:center;
  	border-top:.5pt solid windowtext;
  	border-right:1.0pt solid windowtext;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl79
  	{mso-style-parent:style0;
  	mso-number-format:0%;
  	text-align:center;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:.5pt solid windowtext;}
  .xl80
  	{mso-style-parent:style0;
  	text-align:center;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:.5pt solid windowtext;
  	mso-protection:unlocked visible;}
  .xl81
  	{mso-style-parent:style0;
  	text-align:center;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;
  	mso-protection:unlocked visible;}
  .xl82
  	{mso-style-parent:style0;
  	text-align:center;
  	border-top:.5pt solid windowtext;
  	border-right:1.0pt solid windowtext;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;
  	mso-protection:unlocked visible;}
  .xl83
  	{mso-style-parent:style0;
  	text-align:center;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:.5pt solid windowtext;}
  .xl84
  	{mso-style-parent:style0;
  	text-align:center;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:.5pt solid windowtext;}
  .xl85
  	{mso-style-parent:style0;
  	text-align:center;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl86
  	{mso-style-parent:style0;
  	text-align:center;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:1.0pt solid windowtext;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl87
  	{mso-style-parent:style0;
  	text-align:left;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:1.0pt solid windowtext;
  	border-left:1.0pt solid windowtext;}
  .xl88
  	{mso-style-parent:style0;
  	text-align:left;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:1.0pt solid windowtext;
  	border-left:none;}
  .xl89
  	{mso-style-parent:style0;
  	text-align:center;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:1.0pt solid windowtext;
  	border-left:.5pt solid windowtext;}
  .xl90
  	{mso-style-parent:style0;
  	text-align:center;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:1.0pt solid windowtext;
  	border-left:none;}
  .xl91
  	{mso-style-parent:style0;
  	text-align:center;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:1.0pt solid windowtext;
  	border-bottom:1.0pt solid windowtext;
  	border-left:none;}
  .xl92
  	{mso-style-parent:style0;
  	font-weight:700;
  	vertical-align:top;
  	border-top:1.0pt solid windowtext;
  	border-right:none;
  	border-bottom:none;
  	border-left:1.0pt solid windowtext;}
  .xl93
  	{mso-style-parent:style0;
  	font-weight:700;
  	vertical-align:top;
  	mso-protection:unlocked visible;}
  .xl94
  	{mso-style-parent:style0;
  	font-weight:700;
  	vertical-align:top;
  	border-top:none;
  	border-right:1.0pt solid windowtext;
  	border-bottom:none;
  	border-left:none;
  	mso-protection:unlocked visible;}
  .xl95
  	{mso-style-parent:style0;
  	text-align:left;
  	border-top:none;
  	border-right:none;
  	border-bottom:none;
  	border-left:1.0pt solid windowtext;
  	mso-protection:unlocked visible;}
  .xl96
  	{mso-style-parent:style0;
  	text-align:left;
  	mso-protection:unlocked visible;}
  .xl97
  	{mso-style-parent:style0;
  	text-align:left;
  	border-top:none;
  	border-right:1.0pt solid windowtext;
  	border-bottom:none;
  	border-left:none;
  	mso-protection:unlocked visible;}
  .xl98
  	{mso-style-parent:style0;
  	text-align:left;
  	border-top:none;
  	border-right:none;
  	border-bottom:1.0pt solid windowtext;
  	border-left:1.0pt solid windowtext;
  	mso-protection:unlocked visible;}
  .xl99
  	{mso-style-parent:style0;
  	text-align:left;
  	border-top:none;
  	border-right:none;
  	border-bottom:1.0pt solid windowtext;
  	border-left:none;
  	mso-protection:unlocked visible;}
  .xl100
  	{mso-style-parent:style0;
  	text-align:left;
  	border-top:none;
  	border-right:1.0pt solid windowtext;
  	border-bottom:1.0pt solid windowtext;
  	border-left:none;
  	mso-protection:unlocked visible;}
  .xl101
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:none;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:1.0pt solid windowtext;}
  .xl102
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:none;
  	border-right:none;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl103
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:none;
  	border-right:1.0pt solid windowtext;
  	border-bottom:.5pt solid windowtext;
  	border-left:none;}
  .xl104
  	{mso-style-parent:style0;
  	border-top:1.0pt solid windowtext;
  	border-right:none;
  	border-bottom:none;
  	border-left:1.0pt solid windowtext;}
  .xl105
  	{mso-style-parent:style0;
  	border-top:1.0pt solid windowtext;
  	border-right:none;
  	border-bottom:none;
  	border-left:none;}
  .xl106
  	{mso-style-parent:style0;
  	border-top:1.0pt solid windowtext;
  	border-right:1.0pt solid windowtext;
  	border-bottom:none;
  	border-left:none;}
  .xl107
  	{mso-style-parent:style0;
  	border-top:none;
  	border-right:1.0pt solid windowtext;
  	border-bottom:none;
  	border-left:none;}
  .xl108
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;}
  .xl109
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:none;
  	border-left:1.0pt solid windowtext;}
  .xl110
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:none;
  	border-bottom:none;
  	border-left:none;}
  .xl111
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:.5pt solid windowtext;
  	border-right:1.0pt solid windowtext;
  	border-bottom:none;
  	border-left:none;}
  .xl112
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:none;
  	border-right:none;
  	border-bottom:none;
  	border-left:1.0pt solid windowtext;}
  .xl113
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:none;
  	border-right:none;
  	border-bottom:1.0pt solid windowtext;
  	border-left:1.0pt solid windowtext;}
  .xl114
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:none;
  	border-right:none;
  	border-bottom:1.0pt solid windowtext;
  	border-left:none;}
  .xl115
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:none;
  	border-right:1.0pt solid windowtext;
  	border-bottom:none;
  	border-left:none;}
  .xl116
  	{mso-style-parent:style0;
  	font-weight:700;
  	text-align:center;
  	vertical-align:middle;
  	border-top:none;
  	border-right:1.0pt solid windowtext;
  	border-bottom:1.0pt solid windowtext;
  	border-left:none;}
td{
white-space:normal;
}
  </style>

  </head>

  <body link="#0563C1" vlink="#954F72">

  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:
   collapse;table-layout:fixed;">
   <colgroup><col width="64" span="7" style="width:48pt">
   </colgroup><tbody><tr  style="height:14.4pt">
    <td  class="xl104" width="64" style="height:14.4pt;width:48pt">&nbsp;</td>
    <td class="xl105" width="64" style="width:48pt">&nbsp;</td>
    <td class="xl105" width="64" style="width:48pt">&nbsp;</td>
    <td class="xl105" width="64" style="width:48pt">&nbsp;</td>
    <td class="xl105" width="64" style="width:48pt">&nbsp;</td>
    <td class="xl105" width="64" style="width:48pt">&nbsp;</td>
    <td class="xl106" width="64" style="width:48pt">&nbsp;</td>
   </tr>
   <tr   style="height:14.4pt;border-left: 1px solid black;">
    <td  style="height:14.4pt"  align="left" valign="top"><!--[if gte vml 1]><v:shapetype
     id="_x0000_t75" coordsize="21600,21600" o:spt="75" o:preferrelative="t"
     path="m@4@5l@4@11@9@11@9@5xe" filled="f" stroked="f">
     <v:stroke joinstyle="miter"/>
     <v:formulas>
      <v:f eqn="if lineDrawn pixelLineWidth 0"/>
      <v:f eqn="sum @0 1 0"/>
      <v:f eqn="sum 0 0 @1"/>
      <v:f eqn="prod @2 1 2"/>
      <v:f eqn="prod @3 21600 pixelWidth"/>
      <v:f eqn="prod @3 21600 pixelHeight"/>
      <v:f eqn="sum @0 0 1"/>
      <v:f eqn="prod @6 1 2"/>
      <v:f eqn="prod @7 21600 pixelWidth"/>
      <v:f eqn="sum @8 21600 0"/>
      <v:f eqn="prod @7 21600 pixelHeight"/>
      <v:f eqn="sum @10 21600 0"/>
     </v:formulas>
     <v:path o:extrusionok="f" gradientshapeok="t" o:connecttype="rect"/>
     <o:lock v:ext="edit" aspectratio="t"/>
    </v:shapetype><v:shape id="Picture_x0020_1" o:spid="_x0000_s1025" type="#_x0000_t75"
     alt="&quot;&quot;" style='position:absolute;margin-left:0;margin-top:1.2pt;
     width:63pt;height:37.2pt;z-index:1;visibility:visible' o:gfxdata="UEsDBBQABgAIAAAAIQBamK3CDAEAABgCAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbJSRwU7DMAyG
  70i8Q5QralM4IITW7kDhCBMaDxAlbhvROFGcle3tSdZNgokh7Rjb3+8vyWK5tSObIJBxWPPbsuIM
  UDltsK/5x/qleOCMokQtR4dQ8x0QXzbXV4v1zgOxRCPVfIjRPwpBagArqXQeMHU6F6yM6Rh64aX6
  lD2Iu6q6F8phBIxFzBm8WbTQyc0Y2fM2lWcTjz1nT/NcXlVzYzOf6+JPIsBIJ4j0fjRKxnQ3MaE+
  8SoOTmUi9zM0GE83SfzMhtz57fRzwYF7S48ZjAa2kiG+SpvMhQ4kvFFxEyBNlf/nZFFLhes6o6Bs
  A61m8ih2boF2XxhgujS9Tdg7TMd0sf/X5hsAAP//AwBQSwMEFAAGAAgAAAAhAAjDGKTUAAAAkwEA
  AAsAAABfcmVscy8ucmVsc6SQwWrDMAyG74O+g9F9cdrDGKNOb4NeSwu7GltJzGLLSG7avv1M2WAZ
  ve2oX+j7xL/dXeOkZmQJlAysmxYUJkc+pMHA6fj+/ApKik3eTpTQwA0Fdt3qaXvAyZZ6JGPIoiol
  iYGxlPymtbgRo5WGMqa66YmjLXXkQWfrPu2AetO2L5p/M6BbMNXeG+C934A63nI1/2HH4JiE+tI4
  ipr6PrhHVO3pkg44V4rlAYsBz3IPGeemPgf6sXf9T28OrpwZP6phof7Oq/nHrhdVdl8AAAD//wMA
  UEsDBBQABgAIAAAAIQAc8Di9FQIAAEMFAAASAAAAZHJzL3BpY3R1cmV4bWwueG1spFTRbtsgFH2f
  tH9AvK+2k7h2rThV1KjTpGqLuk17JhjHaBgQ3Cbp3+9i7GaZ9jAtb8CBcw73Hljen3pFDsJ5aXRN
  s5uUEqG5aaTe1/T7t8cPJSUemG6YMlrU9FV4er96/255alzFNO+MI0ihfYULNe0AbJUknneiZ/7G
  WKERbY3rGeDU7ZPGsSOS9yqZpelt4q0TrPGdELCJCF0N3HA0D0KpdZQQjYS1ryl6CKvjntaZPu7m
  Rq3SZRJMheHAgIMvbfvbcpgNiDPHVRZ3h+G0FvDZrLwdiRAaTgysZykwb/QTyZ+SWVnkefFm50J3
  /nfdbF7OirOns/AkZyWPuvqwlXzrRhOfD1tHZFPTGSWa9dghROHFCZLR5LwnnmAVsjwZ/tOPPWP/
  0bGeSY1a5qFjei/W3goOmJygFuuPlqLcML2wu1PSPkqliDPwQ0L3tWMWLWfYT1YF8GpfMYv/lETT
  tpKLjeEvvdAQ4+iEYoBPwXfSekpcJfqdwOq6T01GCceXAOjXOqkhXJhV3vFnLMDVvkMJyzy7o2SH
  vVzk82LkByeAd9fyT82ZGhCT4W3IEatOreuvVQg8WFFyqin+Ia94iTQvFmm8hTgB4YgUd0WWF1hI
  xBdllhUxNtFBYLDOw0dhrnZDAhG2DVszZIsdnjyEIpwlxrjGGgxRxccxvhglMREbBmyq28VvNJ6M
  v9/qFwAAAP//AwBQSwMECgAAAAAAAAAhAPpEvJNlDAAAZQwAABQAAABkcnMvbWVkaWEvaW1hZ2Ux
  LnBuZ4lQTkcNChoKAAAADUlIRFIAAAFyAAABcggDAAAA3/qhOwAAAAFzUkdCAK7OHOkAAAAEZ0FN
  QQAAsY8L/GEFAAABxVBMVEX///++vr5fX18AAADe3t6dnZ0VFRX29vYTExMICAj4+PgvLy/X19dC
  QkL19fXu7u4NDQ0ZGRmvr6+urq4QEBDU1NQpKSnb29sRERHi4uKjo6NiYmKbm5u5ubkkJCSJiYnG
  xsb9/f3BwcGHh4cEBAQPDw8wMDDExMR/f38yMjLJyclLS0vt7e18fHwDAwPy8vJDQ0PCwsKQkJDg
  4ODd3d00NDTMzMxcXFzKysqfn584ODiKioogICCUlJTQ0NB0dHRPT0/Ozs5ISEjm5ub7+/v39/fw
  8PAoKCjn5+fk5OTx8fHNzc2wsLA3NzfV1dXv7+9KSkpkZGQXFxfY2NiDg4OOjo4xMTGsrKwmJiYC
  AgKnp6djY2MLCwuMjIzr6+toaGi6urqPj49XV1dnZ2e3t7etra2EhIRlZWVBQUF2dnZFRUVNTU2q
  qqqWlpY1NTXa2tr5+fn09PT8/PwYGBhWVlZRUVFqamp3d3dOTk5SUlJpaWlubm7j4+O0tLR4eHiA
  gIASEhJZWVkzMzPT09MGBgbs7Oxvb2/l5eUeHh6FhYUWFhYUFBQ6OjpQUFB5eXk9PT3p6em8vLxg
  YGA8PDxdXV0MDAwAAACbtb12AAAAl3RSTlP/////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  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
  ">
     <v:imagedata src="image001.png" o:title=""/>
     <x:ClientData ObjectType="Pict">
      <x:SizeWithCells/>
      <x:CF>Bitmap</x:CF>
      <x:AutoPict/>
     </x:ClientData>
    </v:shape><![endif]--><!--[if !vml]--><span style="mso-ignore:vglayout;
    position:absolute;z-index:1;margin-left:10px;margin-top:-12px;width:84px;
    height:50px"><img width="84" height="50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIMAAABNCAMAAACyoSeQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALcUExURf////Hx8djY2NLS0qCgoIODg8PDw9TU1P7+/ujo6MjIyG9vb0RERAwMDAAAAAICAmNjY7+/v/z8/PT09MbGxpGRkVBQUDAwMBYWFgkJCY6Ojs/Pz21tbYyMjPr6+tnZ2cDAwIuLi01NTRoaGg0NDQEBAYGBgXR0dHBwcKysrICAgEpKShwcHFFRUa6urtXV1QsLC3d3d+/v79vb22dnZzg4OB0dHQUFBWRkZLq6uvj4+FxcXFRUVOXl5efn58fHx6WlpWVlZSkpKQoKChERETExMU9PT39/f7u7u/Dw8KGhoTo6OuPj47m5uYWFhVhYWDQ0NAgICDw8PGhoaJKSksLCwurq6t/f3yQkJDY2NvX19eDg4H5+fj8/PyYmJg4ODh8fHzk5OXx8fLOzs9bW1u3t7UZGRmJiYqioqHl5eRMTExAQEF9fX7W1tezs7FpaWkFBQUlJSS4uLkdHR3V1daSkpMXFxenp6RISEhUVFSsrK1NTU4KCguLi4qqqqiIiIi0tLXJycpiYmObm5ri4uLe3t+Hh4fPz8/b29tfX15SUlJWVlZOTk5eXl93d3ZCQkJaWlt7e3v39/YqKiqampiMjI0tLS9zc3BQUFDU1Nc7OzsTExDIyMtra2iwsLKOjowMDAwYGBqurq15eXhcXFxgYGNDQ0O7u7sHBwT09PRkZGSgoKGxsbA8PD83NzUNDQ/n5+SAgIISEhLGxsaKiop2dnUVFRczMzLy8vHt7e/f3956enmlpaSEhIWBgYCcnJzMzMz4+PsnJyZubm4aGhp+fn8rKygQEBE5OTh4eHpqamhsbG+Tk5FdXVzs7O3h4eNHR0dPT07S0tLa2tr6+vn19fYiIiCoqKuvr642Njfv7+zc3Ny8vL0xMTPLy8mpqaqmpqW5ubiUlJaenp2ZmZltbW6+vr7CwsK2trYeHh5ycnLKyspmZmVlZWWFhYVJSUo+Pj3Fxcb29vQAAAMuq2HYAAAD0dFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wAY4PcXAAAACXBIWXMAABcRAAAXEQHKJvM/AAAERElEQVRoQ+2Zy7HsKAxACYByLuy9ZEFUkAFpKAS2REEEXhLECJDlH3bbU327pmp82n7PmL8khPAVLy8v/x98sCp4SvweCHaSQ2U09O6nmCydbgOoZHr/HfyU6KkP+JDkuvuKotzvMA3DRI9HvFXH/r+vC49t9mYF3k6x0/+gp+9bw4jtjkCJBoQ8udbjBh1l+hNztKX1yOsNTBpj7XFHnFLYDvV7+DrjMgjwRsXe/F1M5m+dAlrlEOXYNz8dx2T+avoLZpxGKXvyl8r+mfh3jMf5a4fW96PuK1ZurMBJlQNl/Q5Aa1z45fRfXl5eXnqAR89cr5oMKR9/JVboZpRfDSTM+s3ql+ydOMPg9lT3SdkGkeo+tWMCAd1gqlDicH+aq21t9poSslSocC9wGnDfDL2AtuDK4P1Zbsv+QI0fCzQGHpPWeNVb67J3G1eh3BJTNFoAHPDQs6pBZRB3Qxtzn7UftI+5kxh8IDat0Pmu0zaXR5ah3gm85zZ1kxlQsqq5Awv9/CSEhcoBoeLumEMLoxHZ0pmSZ0dIQ9mz6npYloK8sywWU6PDlaIkqeYAr5tzGSe2hpvHUJ43zWtWTWzJA7P5nJraQz0UeBnsTZKiyf1hhvNPllxgT7Gc1T4xV6FlfPQC28l8MsnFxd3/HABzm3TMZdUwW7tgb9JdNrA4lwdfRQLVmducTZJx7f0M5/dM8t/oAWHZ0bjZW2Rid7xgj9YxB8t6xP3lATsvyd5irMkDvHORN1kBLKIneijsTLJ8hal88pIHi/OzBNHJ06ubnHrJEw/EJrnPX1zj7hvOZ9gkaV471RyYzWe/IbNZ6RMBXsB1yQvMqjnzkrMP3Pa0uManeiiwEmktsbdoyQMk8a2jXjbqJ3oA70sMGdiUSRW8KU5Yol2lZMtEZpPd+M4lhFLYJtVpXA3JxOhiZI8yx5KLSWKuo190y1Ijk9xqggc+rOpg63hfaWbrDTUvNNbrhmXW1Xz2y59t6oC+8pZsBjhjmZaSi2RWrFrC/DjtG+4PvHAZzqqxoewm/gdrba6/zUW5iLGdL0OmllpXmK/rRXI1wJeXl/8Gq3V6vWQfLOhna98mdCU5Qf3XGmFUNiJbkbzPCV0oPuKFpwyVqz/zGcoX9JwFZCVCECkrK2zGXpXBQsKA37m+T4Absbitf5qLxSu7cnBwY8AoxmAaMD06UF4MeCNJW4x/QWLeNGQLXhs3ihE3e8D3cvBWKA2Pwgg/1O0i4jECYvncUndJlzP6+jSUNMpBT2VAZaoYacmMZZXEncxKLTGYBplECZ9AG1ARN8Bpspe71Z7gDG76yuB0vcPhhJhw15d2woklvIs8hEbZZNdOfTKZCGHKWDgHrJWlxcO1Vh6sg5BNEYZKZ3FYFx8MKtALbwSUR3zAvvAJO8TXuCPhXf6ABMZUAQePgi4VUHD1/1q0VAUsBqVse/Xy8vJyHyH+ARKef7ZwZAAnAAAAAElFTkSuQmCC
  " alt="" v:shapes="Picture_x0020_1"></span><!--[endif]--></td>
    <td colspan="5" style="mso-ignore:colspan"></td>
    <td class="xl107">&nbsp;</td>
   </tr>
   <tr  style="height:14.4pt">
    <td  class="xl65" style="height:14.4pt">&nbsp;</td>
    <td></td>
    <td colspan="3" class="xl108">${handlingType === "Arrival" ? "ARRIVAL" : "DEPARTURE"
		} INFORMATION</td>
    <td></td>
    <td class="xl107">&nbsp;</td>
   </tr>
   <tr height="20" style="height:15.0pt">
    <td height="20" class="xl65" style="height:15.0pt">&nbsp;</td>
    <td colspan="3" style="mso-ignore:colspan"></td>
    <td class="xl66">&nbsp;</td>
    <td class="xl66">&nbsp;</td>
    <td class="xl67">&nbsp;</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl68" style="border-right:.5pt solid black; border-left:.5pt solid black;
    height:14.4pt">NAME</td>
    <td colspan="3" class="xl70" style="border-right:1.0pt solid black;border-left:
    none">DATE</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl73" style="border-right:.5pt solid black;
    height:14.4pt">DATE</td>
    <td colspan="3" class="xl76" style="border-right:1.0pt solid black;border-left:
    none">${handlingType === "Arrival" ? arrivalDate : departureDate}</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl73" style="border-right:.5pt solid black;
    height:14.4pt">FLIGHT NO.</td>
    <td colspan="3" class="xl79" style="border-right:1.0pt solid black;border-left:
    none">${flightNumber}</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl73" style="border-right:.5pt solid black;
    height:14.4pt">OPERATOR</td>
    <td colspan="3" class="xl80" style="border-right:1.0pt solid black;border-left:
    none">${operatorName}</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl73" style="border-right:.5pt solid black;
    height:14.4pt">ROUTE</td>
    <td colspan="3" class="xl83" style="border-right:1.0pt solid black;border-left:
    none">${handlingType === "Arrival"
			? `${arrival.from}-${config.defaultAirport}`
			: `${config.defaultAirport}-${departure.to}`
		}</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl73" style="border-right:.5pt solid black;
    height:14.4pt">A/C REG</td>
    <td colspan="3" class="xl83" style="border-right:1.0pt solid black;border-left:
    none">${aircraftRegistration}</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl73" style="border-right:.5pt solid black;
    height:14.4pt">A/C TYPE</td>
    <td colspan="3" class="xl83" style="border-right:1.0pt solid black;border-left:
    none">${aircraftType}</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl73" style="border-right:.5pt solid black;
    height:14.4pt">MTOW (kg)</td>
    <td colspan="3" class="xl83" style="border-right:1.0pt solid black;border-left:
    none">${mtow}</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl73" style="border-right:.5pt solid black;
    height:14.4pt">CREW No.</td>
    <td colspan="3" class="xl80" style="border-right:1.0pt solid black;border-left:
    none">${handlingType === "Arrival" ? arrival.crewNumber : departure.crewNumber
		}</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl73" style="border-right:.5pt solid black;
    height:14.4pt">PAX No.</td>
    <td colspan="3" class="xl80" style="border-right:1.0pt solid black;border-left:
    none">${handlingType === "Departure"
			? Number(departure?.adultCount) + Number(departure?.minorCount)
			: Number(arrival?.adultCount) + Number(arrival?.minorCount)
		}</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl73" style="border-right:.5pt solid black;
    height:14.4pt">CARGO</td>
    <td colspan="3" class="xl80" style="border-right:1.0pt solid black;border-left:
    none">${handlingType === "Arrival" ? arrival.cargoInfo : departure.cargoInfo
		}</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="4"  class="xl73" style="border-right:.5pt solid black;
    height:14.4pt">MAIL</td>
    <td colspan="3" class="xl84" style="border-right:1.0pt solid black;border-left:
    none">${handlingType === "Arrival" ? arrival.mailInfo : departure.mailInfo
		}</td>
   </tr>
   <tr height="20" style="height:15.0pt">
    <td colspan="4" height="20" class="xl87" style="height:15.0pt">SPECIAL</td>
    <td colspan="3" class="xl89" style="border-right:1.0pt solid black">${handlingType === "Arrival" ? arrival.specialInfo : departure.specialInfo
		}</td>
   </tr>
   <tr  style="height:14.4pt">
    <td  class="xl92" style="height:14.4pt;border-top:none">REMARKS</td>
    <td class="xl93"></td>
    <td class="xl93"></td>
    <td class="xl93"></td>
    <td class="xl93"></td>
    <td class="xl93"></td>
    <td class="xl94">&nbsp;</td>
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="7" rowspan="6" height="115" class="xl95" style="border-right:1.0pt solid black;
    border-bottom:1.0pt solid black;height:87.0pt">${handlingType === "Arrival" ? arrival.remarksInfo : departure.remarksInfo
		}</td>
   </tr>
   <tr  style="height:14.4pt">
   </tr>
   <tr  style="height:14.4pt">
   </tr>
   <tr  style="height:14.4pt">
   </tr>
   <tr  style="height:14.4pt">
   </tr>
   <tr height="20" style="height:15.0pt">
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="7"  class="xl101" style="border-right:1.0pt solid black;
    height:14.4pt">PILOT IN COMMAND</td>
   </tr>
   <tr  style="mso-height-source:userset;height:14.4pt">
    <td colspan="3" rowspan="2" height="38" class="xl109" style="border-bottom:.5pt solid black;
    height:28.8pt">NAME<span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;</span></td>
    <td colspan="4" rowspan="2" class="xl110" style="border-right:1.0pt solid black;
    border-bottom:.5pt solid black">${crew?.name}</td>
   </tr>
   <tr  style="height:14.4pt">
   </tr>
   <tr  style="height:14.4pt">
    <td colspan="2" rowspan="4" height="77" class="xl109" style="border-bottom:1.0pt solid black;
    height:58.2pt">SIGNATURE</td>
    <td colspan="5" rowspan="4" class="xl110" style="border-right:1.0pt solid black;
    border-bottom:1.0pt solid black"><img width="150" height="50" src="data:image/png;base64,${flight?.crew?.signature
		}"></td>
   </tr>
   <tr  style="height:14.4pt">
   </tr>
   <tr  style="height:14.4pt">
   </tr>
   <tr height="20" style="height:15.0pt">
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
   </tr>
   <!--[endif]-->
  </tbody></table>
  </body></html>`;
}
