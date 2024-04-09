import * as React from "react";
import {
  View,
  StyleSheet,
  Button,
  Platform,
  Text,
  Linking,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const html = `
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta name="ProgId" content="Excel.Sheet">
<meta name="Generator" content="Microsoft Excel 15">
<link id="Main-File" rel="Main-File" href="../CharteNote_TEst.htm">
<link rel="File-List" href="filelist.xml">
<!--[if !mso]>
<style>
v\:* {behavior:url(#default#VML);}
o\:* {behavior:url(#default#VML);}
x\:* {behavior:url(#default#VML);}
.shape {behavior:url(#default#VML);}
</style>
<![endif]-->
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
<!--[if !supportTabStrip]--><script language="JavaScript">
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
}

if (window.name!="frSheet")
 window.location.replace("../CharteNote_TEst.htm");
else
 fnUpdateTabs();
//-->
</script>
<!--[endif]-->
</head>

<body link="#0563C1" vlink="#954F72">

<table border="0" cellpadding="0" cellspacing="0" width="640" style="border-collapse:
 collapse;table-layout:fixed;width:480pt">
 <colgroup><col width="64" span="10" style="width:48pt">
 </colgroup><tbody><tr height="19" style="height:14.4pt">
  <td height="19" width="64" style="height:14.4pt;width:48pt" align="left" valign="top"><!--[if gte vml 1]><v:group id="Shape_x0020_2" o:spid="_x0000_s1049"
   alt="&quot;&quot;" style='position:absolute;margin-left:1.2pt;margin-top:0;
   width:470.4pt;height:51.6pt;z-index:1' coordorigin="21122,33799"
   coordsize="64674,8001">
   <o:lock v:ext="edit" text="t"/>
   <v:group id="Shape_x0020_3" o:spid="_x0000_s1051" style='position:absolute;
    left:21122;top:33799;width:64675;height:8001' coordorigin="21122,33799"
    coordsize="64674,8001">
    <o:lock v:ext="edit" text="t"/>
    <v:shapetype id="_x0000_t75" coordsize="21600,21600" o:spt="75"
     o:preferrelative="t" path="m@4@5l@4@11@9@11@9@5xe" filled="f" stroked="f">
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
    </v:shapetype><v:shape id="Shape_x0020_4" o:spid="_x0000_s1052" type="#_x0000_t75"
     style='position:absolute;left:21112;top:33799;width:64689;height:7999;
     visibility:visible' o:gfxdata="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
">
     <v:imagedata src="image001.png" o:title=""/>
     <o:lock v:ext="edit" aspectratio="f"/>
     <x:ClientData ObjectType="Pict">
      <x:CF>Bitmap</x:CF>
      <x:AutoPict/>
     </x:ClientData>
    </v:shape><v:group id="Shape_x0020_5" o:spid="_x0000_s1053" style='position:absolute;
     left:21122;top:33799;width:64675;height:8001' coordorigin="21122,33799"
     coordsize="64674,8001">
     <o:lock v:ext="edit" text="t"/>
     <v:shape id="Shape_x0020_6" o:spid="_x0000_s1054" type="#_x0000_t75"
      style='position:absolute;left:21112;top:33799;width:64689;height:7999;
      visibility:visible' o:gfxdata="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
AAAAAAQABAD1AAAAtQUAAAAA
">
      <v:imagedata src="image001.png" o:title=""/>
      <o:lock v:ext="edit" aspectratio="f"/>
      <x:ClientData ObjectType="Pict">
       <x:CF>Bitmap</x:CF>
       <x:AutoPict/>
      </x:ClientData>
     </v:shape><v:group id="Shape_x0020_7" o:spid="_x0000_s1055" style='position:absolute;
      left:21122;top:33799;width:64675;height:8001' coordorigin="21122,33799"
      coordsize="64674,8001">
      <o:lock v:ext="edit" text="t"/>
      <v:shape id="Shape_x0020_8" o:spid="_x0000_s1056" type="#_x0000_t75"
       style='position:absolute;left:21112;top:33799;width:64689;height:7999;
       visibility:visible' o:gfxdata="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
AAAAAAQABAD1AAAAtQUAAAAA
">
       <v:imagedata src="image001.png" o:title=""/>
       <o:lock v:ext="edit" aspectratio="f"/>
       <x:ClientData ObjectType="Pict">
        <x:CF>Bitmap</x:CF>
        <x:AutoPict/>
       </x:ClientData>
      </v:shape><v:group id="Shape_x0020_9" o:spid="_x0000_s1057" style='position:absolute;
       left:21122;top:33799;width:64675;height:8001' coordorigin="39363,25664"
       coordsize="43192,12913">
       <o:lock v:ext="edit" text="t"/>
       <v:shape id="Shape_x0020_10" o:spid="_x0000_s1058" type="#_x0000_t75"
        style='position:absolute;left:39357;top:25664;width:43201;height:12910;
        visibility:visible' o:gfxdata="UEsDBBQABgAIAAAAIQDw94q7/QAAAOIBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbJSRzUrEMBDH
74LvEOYqbaoHEWm6B6tHFV0fYEimbdg2CZlYd9/edD8u4goeZ+b/8SOpV9tpFDNFtt4puC4rEOS0
N9b1Cj7WT8UdCE7oDI7ekYIdMayay4t6vQvEIrsdKxhSCvdSsh5oQi59IJcvnY8TpjzGXgbUG+xJ
3lTVrdTeJXKpSEsGNHVLHX6OSTxu8/pAEmlkEA8H4dKlAEMYrcaUSeXszI+W4thQZudew4MNfJUx
QP7asFzOFxx9L/lpojUkXjGmZ5wyhjSRJQ8YKGvKv1MWzIkL33VWU9lGfl98J6hz4cZ/uUjzf7Pb
bHuj+ZQu9z/UfAMAAP//AwBQSwMEFAAGAAgAAAAhADHdX2HSAAAAjwEAAAsAAABfcmVscy8ucmVs
c6SQwWrDMAyG74O9g9G9cdpDGaNOb4VeSwe7CltJTGPLWCZt376mMFhGbzvqF/o+8e/2tzCpmbJ4
jgbWTQuKomXn42Dg63xYfYCSgtHhxJEM3Elg372/7U40YalHMvokqlKiGBhLSZ9aix0poDScKNZN
zzlgqWMedEJ7wYH0pm23Ov9mQLdgqqMzkI9uA+p8T9X8hx28zSzcl8Zy0Nz33r6iasfXeKK5UjAP
VAy4LM8w09zU50C/9q7/6ZURE31X/kL8TKv1x6wXNXYPAAAA//8DAFBLAwQUAAYACAAAACEAg229
8xoCAAA2BQAAEAAAAGRycy9zaGFwZXhtbC54bWykVE1v2zAMvQ/YfxB0Xx3nC41Rp0g3ZBgQFMGy
/QBGlhNvsqRJjOv014+S3Da77NCcJIrU0yMfqbv7vlWsk843Rpc8vxlxJrUwVaMPJf/5Y/3pljOP
oCtQRsuSn6Xn98uPH+76yhVm/0sKZAShfUEHJT8i2iLLvDjKFvyNsVKTtzauBSTTHbLKwROBtyob
j0bzzFsnofJHKfFL8vBlxPaWtSCcKTlnKHtUjf5N++TU3c5uXdqLx27rWFMReyKvoSWWuyNYycjO
XmPCBbKywPvyuo9AUPS1a4dM4B15tNBoIgeFqWvWl3yymMwnt1S8c8nHs/l8OotkoKBUmKCA6SRf
jMczzgRF5ONFPkkRWaISoKzz+FWaq2mxAFRyR1pFitBtPIZavD0RntNm3Sh1bQ0IFwqlr4V5I5SI
Kj1ol/QKKmL/YKpzCNzTSj2Q+vDd6jFvxbqhUm3A4xYcAeWcPTmwJfd/TuAkZ+qb9iVf5NOgHF4a
7tLYXxqgxdHQbAh0nCXjM5I9imJoszqhqZtBkJRKrKHHHZ6VvDatKIi9FiUwokmhmXSbQJ2pTsW1
0ZXU1F10BOpAf4jizGH0hTtU0wdZD7stetZB9CVV//GuavxP3ODdn3bPrzD5dDRM1f60NhoZnq2s
QdAPsHINqDD+1B2nR/q60oPDsEtdBYG/U0L+mWQecMJADG320lzxv/Avp+nDW/4FAAD//wMAUEsD
BBQABgAIAAAAIQCeWf0dFgEAAJQBAAAPAAAAZHJzL2Rvd25yZXYueG1sdJBbSwMxEIXfBf9DGMG3
NnuxW1ubFhG1BcHSVt/T7GR3cZNdkvT2751VoQj6mHPmfDkzk9nR1GyPzleNFRD3I2BoVZNXthDw
tnnq3QLzQdpc1o1FASf0MJteXkzkOG8OdoX7dSgYQawfSwFlCO2Yc69KNNL3mxYtebpxRgZ6uoLn
Th4IbmqeRFHGjaws/VDKFh9KVB/rnREw2i33Q+X4u7JKb+ZLfF6fXowQ11fH+ztgAY/hPPyTXuRU
n9rr+WnrqnwlfUAngBTajiyYUuXWoao8PmqNKrxq7TH4Tq8ZLd/LshQYYW7SeJQkA+CdFTqLKB0+
GcXpIPrWXacnwz8S2y9YOqTL/Q7x/wqQcT7m9BMAAP//AwBQSwECLQAUAAYACAAAACEA8PeKu/0A
AADiAQAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQItABQABgAIAAAA
IQAx3V9h0gAAAI8BAAALAAAAAAAAAAAAAAAAAC4BAABfcmVscy8ucmVsc1BLAQItABQABgAIAAAA
IQCDbb3zGgIAADYFAAAQAAAAAAAAAAAAAAAAACkCAABkcnMvc2hhcGV4bWwueG1sUEsBAi0AFAAG
AAgAAAAhAJ5Z/R0WAQAAlAEAAA8AAAAAAAAAAAAAAAAAcQQAAGRycy9kb3ducmV2LnhtbFBLBQYA
AAAABAAEAPUAAAC0BQAAAAA=
">
        <v:imagedata src="image001.png" o:title=""/>
        <o:lock v:ext="edit" aspectratio="f"/>
        <x:ClientData ObjectType="Pict">
         <x:CF>Bitmap</x:CF>
         <x:AutoPict/>
        </x:ClientData>
       </v:shape><v:shape id="Shape_x0020_11" o:spid="_x0000_s1059" type="#_x0000_t75"
        style='position:absolute;left:39357;top:25664;width:43201;height:12910;
        visibility:visible' o:gfxdata="UEsDBBQABgAIAAAAIQDw94q7/QAAAOIBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbJSRzUrEMBDH
74LvEOYqbaoHEWm6B6tHFV0fYEimbdg2CZlYd9/edD8u4goeZ+b/8SOpV9tpFDNFtt4puC4rEOS0
N9b1Cj7WT8UdCE7oDI7ekYIdMayay4t6vQvEIrsdKxhSCvdSsh5oQi59IJcvnY8TpjzGXgbUG+xJ
3lTVrdTeJXKpSEsGNHVLHX6OSTxu8/pAEmlkEA8H4dKlAEMYrcaUSeXszI+W4thQZudew4MNfJUx
QP7asFzOFxx9L/lpojUkXjGmZ5wyhjSRJQ8YKGvKv1MWzIkL33VWU9lGfl98J6hz4cZ/uUjzf7Pb
bHuj+ZQu9z/UfAMAAP//AwBQSwMEFAAGAAgAAAAhADHdX2HSAAAAjwEAAAsAAABfcmVscy8ucmVs
c6SQwWrDMAyG74O9g9G9cdpDGaNOb4VeSwe7CltJTGPLWCZt376mMFhGbzvqF/o+8e/2tzCpmbJ4
jgbWTQuKomXn42Dg63xYfYCSgtHhxJEM3Elg372/7U40YalHMvokqlKiGBhLSZ9aix0poDScKNZN
zzlgqWMedEJ7wYH0pm23Ov9mQLdgqqMzkI9uA+p8T9X8hx28zSzcl8Zy0Nz33r6iasfXeKK5UjAP
VAy4LM8w09zU50C/9q7/6ZURE31X/kL8TKv1x6wXNXYPAAAA//8DAFBLAwQUAAYACAAAACEAevFu
nrICAACTBgAAEAAAAGRycy9zaGFwZXhtbC54bWysVdtunDAQfa/Uf7D83rDA7iagkCgXbVUpalfd
9AMGMAutsaltCJuv79iG7bZqX5I8MeMZz83nDJfXY8vJwJRupMhoeLaghIlClo3YZ/Tb4+bDBSXa
gCiBS8EyemCaXl+9f3c5liqV+XdWGIIhhE7xIKO1MV0aBLqoWQv6THZMoLWSqgWDqtoHpYInDN7y
IFos1oHuFINS14yZe2+hVy627kgLhZIZpcSw0fBG/EDZG8Ww67bKy8XnYatIU2L1ISUCWqxyV0PH
COrB0cdeQC2wdZ9e1y4QpGOl2qkTeEEfLTQCi4NUVhUZMxon8Tq+wOEdMhqt1uvlamGLgRRbIQU6
LOMwiaIVJQV6hFESxt4j8KVY16LX5iOTb1IWDA/auAL25SxBPUvFKGZR2RflGeU49owaSvBVFSV5
RnPfQAfG3rMFWpE8Yfnn0fk6oaTO6Cpcr5aIodGo3mLqCz7awg2mlQN7lO4aQsae2tl4f/swkP72
4OLUcw5vB5WcX9gy0Hv2mb+di3ri6wb+X8c49gVEYfJXwIJLzXwO26BLdmwa483PYlvRkjflpuH8
LaCj1T6/44oMgPO/T+6Wtw7AmPKYxubk4i2SCWnLnkc5EcOTwVLEjLeyPNh0OX6RYJ7kL6YG0V2x
aZQ2D6DNFhQGQrY+Kegyqn/2oBgl/JPQGU3CpaWFOVXUqZKfKiCKWiJEC4Mg9cqdQd1jTsib3siq
scjHMfpW3Ay12ZkDZ69tC+MiDV4bxQXBGbegHhwx+IAIQHw2omQCaYgi8D0uaGSlMs5m7+BMb1k1
SVujPXJm3P9hvakcY/HsX36TNe93z0dzGC6mlZX3GykMMYeOVVDger1RDXC/DfL+M/4XJrbYlYwb
TpT2gb9iQ/oZn3mKg/PvJpjN4HLLWM+n/m9y9QsAAP//AwBQSwMEFAAGAAgAAAAhAL6AkiMZAQAA
lAEAAA8AAABkcnMvZG93bnJldi54bWx0kEtPwzAQhO9I/Adrkbi1zoOmtNSpCgLRcgA1oJ7dZJMY
Eiey3eevZwNIFRIcPbPzeWcn031dsS0aqxotwO97wFCnTaZ0IeDt9aF3Dcw6qTNZNRoFHNDCND4/
m8hx1uz0EreJKxhBtB1LAaVz7Zhzm5ZYS9tvWtTk5Y2ppaOnKXhm5I7gdcUDz4t4LZWmH0rZ4l2J
6UeyqQWop3Blk+i4mi9uo5fZJlXB+0IJcXmxn90Ac7h3p+Gf9Dyj9X1g+eNhbVS2lNahEUB9qB1Z
ENPKrcFUWbzPc0zdc55bdLbTK0ble1EUAiPMVeiPgmAAvLNcZxGlwwcjPxx437rp9GD4R2L9BQuH
dLnfIf7fAmScjhl/AgAA//8DAFBLAQItABQABgAIAAAAIQDw94q7/QAAAOIBAAATAAAAAAAAAAAA
AAAAAAAAAABbQ29udGVudF9UeXBlc10ueG1sUEsBAi0AFAAGAAgAAAAhADHdX2HSAAAAjwEAAAsA
AAAAAAAAAAAAAAAALgEAAF9yZWxzLy5yZWxzUEsBAi0AFAAGAAgAAAAhAHrxbp6yAgAAkwYAABAA
AAAAAAAAAAAAAAAAKQIAAGRycy9zaGFwZXhtbC54bWxQSwECLQAUAAYACAAAACEAvoCSIxkBAACU
AQAADwAAAAAAAAAAAAAAAAAJBQAAZHJzL2Rvd25yZXYueG1sUEsFBgAAAAAEAAQA9QAAAE8GAAAA
AA==
">
        <v:imagedata src="image002.png" o:title=""/>
        <o:lock v:ext="edit" aspectratio="f"/>
        <x:ClientData ObjectType="Pict">
         <x:CF>Bitmap</x:CF>
         <x:AutoPict/>
        </x:ClientData>
       </v:shape><v:shape id="Shape_x0020_12" o:spid="_x0000_s1060" type="#_x0000_t75"
        style='position:absolute;left:39357;top:25664;width:43201;height:12427;
        visibility:visible' o:gfxdata="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
">
        <v:imagedata src="image003.png" o:title=""/>
        <o:lock v:ext="edit" aspectratio="f"/>
        <x:ClientData ObjectType="Pict">
         <x:CF>Bitmap</x:CF>
         <x:AutoPict/>
        </x:ClientData>
       </v:shape></v:group></v:group></v:group></v:group><x:ClientData
    ObjectType="Group">
    <x:SizeWithCells/>
    <x:Locked>False</x:Locked>
   </x:ClientData>
  </v:group><v:shape id="Picture_x0020_12" o:spid="_x0000_s1050" type="#_x0000_t75"
   alt="&quot;&quot;" style='position:absolute;margin-left:361.2pt;
   margin-top:25.2pt;width:116.4pt;height:70.2pt;z-index:2;visibility:visible'
   o:gfxdata="UEsDBBQABgAIAAAAIQBamK3CDAEAABgCAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbJSRwU7DMAyG
70i8Q5QralM4IITW7kDhCBMaDxAlbhvROFGcle3tSdZNgokh7Rjb3+8vyWK5tSObIJBxWPPbsuIM
UDltsK/5x/qleOCMokQtR4dQ8x0QXzbXV4v1zgOxRCPVfIjRPwpBagArqXQeMHU6F6yM6Rh64aX6
lD2Iu6q6F8phBIxFzBm8WbTQyc0Y2fM2lWcTjz1nT/NcXlVzYzOf6+JPIsBIJ4j0fjRKxnQ3MaE+
8SoOTmUi9zM0GE83SfzMhtz57fRzwYF7S48ZjAa2kiG+SpvMhQ4kvFFxEyBNlf/nZFFLhes6o6Bs
A61m8ih2boF2XxhgujS9Tdg7TMd0sf/X5hsAAP//AwBQSwMEFAAGAAgAAAAhAAjDGKTUAAAAkwEA
AAsAAABfcmVscy8ucmVsc6SQwWrDMAyG74O+g9F9cdrDGKNOb4NeSwu7GltJzGLLSG7avv1M2WAZ
ve2oX+j7xL/dXeOkZmQJlAysmxYUJkc+pMHA6fj+/ApKik3eTpTQwA0Fdt3qaXvAyZZ6JGPIoiol
iYGxlPymtbgRo5WGMqa66YmjLXXkQWfrPu2AetO2L5p/M6BbMNXeG+C934A63nI1/2HH4JiE+tI4
ipr6PrhHVO3pkg44V4rlAYsBz3IPGeemPgf6sXf9T28OrpwZP6phof7Oq/nHrhdVdl8AAAD//wMA
UEsDBBQABgAIAAAAIQDHmJ7AIwIAAFIFAAASAAAAZHJzL3BpY3R1cmV4bWwueG1spFRNj5swFLxX
6n+wfO+CQwgEBVbRRltVWrVRP9SzY0ywCrZle5Psv+8zBqKoPVTNDd7YM8N789g8XvoOnbixQskS
k4cYIy6ZqoU8lvjH9+cPOUbWUVnTTkle4jdu8WP1/t3mUpuCStYqg4BC2gIKJW6d00UUWdbyntoH
pbkEtFGmpw5ezTGqDT0Ded9FizheRVYbTmvbcu52AcHVwO3O6ol33TZI8Fq4rS0xePDV8UxjVB9O
M9VV2SbypvzjwAAPX5qmSsg6zlcz5ksDbNS5IqHsH6eax8lykWfJjA1XBu6roFOzSLWeyeeav5Jm
WbZOZ+xGePTzhzBZLeLlX4QnOS1Y0JCnvWB7Mwp+Pu0NEjUMMMFI0h4GBbB7NRyRBY6up8IdWgDP
i2K/7Dg7+h+T66mQIKaeWiqPfGs1Zw4MeLUwBzAV5IbXG8OHTuhn0XXIKPdTuPZbSzV4JjBXWnjw
bl8hk/+USNU0gvGdYq89ly7E0vCOOlgJ2wptMTIF7w8c+ms+1QQjBhvhwK82Qjr/wbSwhn2FBtzt
27cwT8kao0OJF8s0yUZ+Z7hj7b3803CmAYRkWO2TRItLY/p7FTwPdBRdSryE1UvzFUZvJU5InEI4
h17xi0MMcLKEBYnhUxkcyPMsS0J6ghFPpI11H7m62xTyRDA9mNAQMXp6sc734ioxpja0Ykgs7Mi4
OJ2AYOyoo1P7bn5O483wM6x+AwAA//8DAFBLAwQKAAAAAAAAACEA+kS8k2UMAABlDAAAFAAAAGRy
cy9tZWRpYS9pbWFnZTEucG5niVBORw0KGgoAAAANSUhEUgAAAXIAAAFyCAMAAADf+qE7AAAAAXNS
R0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHFUExURf///76+vl9fXwAAAN7e3p2dnRUVFfb29hMT
EwgICPj4+C8vL9fX10JCQvX19e7u7g0NDRkZGa+vr66urhAQENTU1CkpKdvb2xEREeLi4qOjo2Ji
Ypubm7m5uSQkJImJicbGxv39/cHBwYeHhwQEBA8PDzAwMMTExH9/fzIyMsnJyUtLS+3t7Xx8fAMD
A/Ly8kNDQ8LCwpCQkODg4N3d3TQ0NMzMzFxcXMrKyp+fnzg4OIqKiiAgIJSUlNDQ0HR0dE9PT87O
zkhISObm5vv7+/f39/Dw8CgoKOfn5+Tk5PHx8c3NzbCwsDc3N9XV1e/v70pKSmRkZBcXF9jY2IOD
g46OjjExMaysrCYmJgICAqenp2NjYwsLC4yMjOvr62hoaLq6uo+Pj1dXV2dnZ7e3t62trYSEhGVl
ZUFBQXZ2dkVFRU1NTaqqqpaWljU1Ndra2vn5+fT09Pz8/BgYGFZWVlFRUWpqand3d05OTlJSUmlp
aW5ubuPj47S0tHh4eICAgBISEllZWTMzM9PT0wYGBuzs7G9vb+Xl5R4eHoWFhRYWFhQUFDo6OlBQ
UHl5eT09Penp6by8vGBgYDw8PF1dXQwMDAAAAJu1vXYAAACXdFJOU///////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
/////////////////////////wDxn5gTAAAACXBIWXMAACHVAAAh1QEEnLSdAAAJhklEQVR4Xu3d
zW7bOBSG4QK5gGy7CGZuoYsi11Og2y4LdN8rH1F8JVM+lPVD2fIk7zNALPI7PJI1GScT2/IXSZIk
SZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZKkz+XHz5eXl9+vjHRX
b925Ln1lXnfBWb5GqoNxeuuo0VG+cmJvoVTtOKPLqFeLH5zMlVilnTiNW7DyI0p37x+27+F7fwI3
Y/UHxB280z38RvftaPAhcRePv4/03YUWHxR38tC7+UrLnejyYXE3O0w0WvNL9030+ci4px0m9qNP
g190+ti4swkze/yiRYvP8xct7nDynalt/mF1k327/p/iPmfMrcayNvT6PLjfYHKFxt9Lss/x4B1w
78HkbdS2oddnxBkYMDuLsiY/6fVZXT8XxnTFxj8G1tHrc+NcjJieOuL3kn/pJU7IxTvBgOkmtFLG
WSkQHPNY4jd3xKkpzExv5mskZnB+sr9xap/rhyeVOEkvf9LgnUGD/K9NN6TT1H9T7n8eZ+TL3Nbj
lDXo/yPROpyzBjTSapy4XWihbTh7W31jubbjFG7BSu3GiVzFX7mP9C9ndY6/A0qSJEmSJEmSJEmS
JEmSJEnSx8NLxncor8u083qfV2g2YLYZ7e6LfUW1y6wS7XF5J8VvZlrRLmPuADS8p/l3J1NQItmF
FvGKLnvRLmPuADS8p7/sKqKgRLIHHTpMtJpe0oLJA9DwnthTRF4i2YUWHSZa0Q1MtqPfPc1eBZV8
gmgPOiTMNKLZgNl29Lsn9hS8kZeI9qBDwkwjmg3mHyE3ot89saeg9n5Noj3o0GOqDb1Gf5hvRbt7
Yk8B8QTRHnQAky3oVCBo84AraMz+okw+QVTx9vbr2+/qP28J6+fRpoKCtd7fyp3X/qHvDNrcE3uK
yEuzR0vegEYR+ZHoXPWIN2Szq4i8RBKRN6BRQHwkOldRcl/sK6hdsZooIG5Bp4D4QDSuouTO2FlA
PEEUEDegUUR+GNrWUXNn7CwinyAKiBvQKCI/Cl2rKLk7dheRl0gi8gY0CogPcvMy6tTcH/uLyEsk
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
e15a2ZG5avk0CGKuZKPphVoe8K3G4nv7owTkuM41V9qG9Vce2XJz3MUnLsTjQ796Beax9+PyhX4v
KX4Ew1+ogIwC9u1KF7WxrNqga34p/blfWaOYNd2gWWFaAQkM+qOqHPrBJgljOgSNrq2Iws4C4IOt
N2c4vsDzWzicRcEt/JzMw+k/zMdQ2YLEeMLsDwAA//8DAFBLAwQUAAYACAAAACEAqiYOvrwAAAAh
AQAAHQAAAGRycy9fcmVscy9waWN0dXJleG1sLnhtbC5yZWxzhI9BasMwEEX3hdxBzD6WnUUoxbI3
oeBtSA4wSGNZxBoJSS317SPIJoFAl/M//z2mH//8Kn4pZRdYQde0IIh1MI6tguvle/8JIhdkg2tg
UrBRhnHYffRnWrHUUV5czKJSOCtYSolfUma9kMfchEhcmzkkj6WeycqI+oaW5KFtjzI9M2B4YYrJ
KEiT6UBctljN/7PDPDtNp6B/PHF5o5DOV3cFYrJUFHgyDh9h10S2IIdevjw23AEAAP//AwBQSwEC
LQAUAAYACAAAACEAWpitwgwBAAAYAgAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNd
LnhtbFBLAQItABQABgAIAAAAIQAIwxik1AAAAJMBAAALAAAAAAAAAAAAAAAAAD0BAABfcmVscy8u
cmVsc1BLAQItABQABgAIAAAAIQDHmJ7AIwIAAFIFAAASAAAAAAAAAAAAAAAAADoCAABkcnMvcGlj
dHVyZXhtbC54bWxQSwECLQAKAAAAAAAAACEA+kS8k2UMAABlDAAAFAAAAAAAAAAAAAAAAACNBAAA
ZHJzL21lZGlhL2ltYWdlMS5wbmdQSwECLQAUAAYACAAAACEAycesNhMBAACKAQAADwAAAAAAAAAA
AAAAAAAkEQAAZHJzL2Rvd25yZXYueG1sUEsBAi0AFAAGAAgAAAAhAKomDr68AAAAIQEAAB0AAAAA
AAAAAAAAAAAAZBIAAGRycy9fcmVscy9waWN0dXJleG1sLnhtbC5yZWxzUEsFBgAAAAAGAAYAhAEA
AFsTAAAAAA==
">
   <v:imagedata src="image004.png" o:title=""/>
   <x:ClientData ObjectType="Pict">
    <x:SizeWithCells/>
    <x:CF>Bitmap</x:CF>
    <x:AutoPict/>
   </x:ClientData>
  </v:shape><![endif]--><!--[if !vml]--><span style="mso-ignore:vglayout;
  position:absolute;z-index:1;margin-left:2px;margin-top:0px;width:635px;
  height:128px"><img width="635" height="128" src="image005.png" v:shapes="Shape_x0020_2 Shape_x0020_3 Shape_x0020_4 Shape_x0020_5 Shape_x0020_6 Shape_x0020_7 Shape_x0020_8 Shape_x0020_9 Shape_x0020_10 Shape_x0020_11 Shape_x0020_12 Picture_x0020_12"></span><!--[endif]--><span style="mso-ignore:vglayout2">
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
  <td class="xl72">########</td>
  <td class="xl73">//</td>
  <td class="xl65">YRTAB</td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl65"></td>
  <td class="xl66"></td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl74" style="height:14.4pt">A/C TYPE</td>
  <td class="xl75" style="border-left:none">SR22T</td>
  <td colspan="3" class="xl76" style="border-right:1.0pt solid black">ARRIVAL</td>
  <td colspan="2" class="xl76" style="border-right:1.0pt solid black;border-left:
  none">DEPARTURE</td>
  <td colspan="3" class="xl79" style="border-right:1.0pt solid black;border-left:
  none">CARRIER</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl82" style="height:14.4pt;border-top:none">A/C REG</td>
  <td class="xl83" style="border-top:none;border-left:none">YR-TAB</td>
  <td class="xl84" style="border-top:none">FROM</td>
  <td class="xl85" style="border-top:none">&nbsp;</td>
  <td class="xl86" style="border-top:none">LUKK</td>
  <td class="xl84" style="border-top:none;border-left:none">TO</td>
  <td class="xl86" style="border-top:none;border-left:none">LUKK</td>
  <td colspan="3" rowspan="3" class="xl87" style="border-right:1.0pt solid black">PRIVATE</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl90" style="height:14.4pt;border-top:none">FLT NO.</td>
  <td class="xl91" style="border-top:none;border-left:none">YRTAB</td>
  <td class="xl84" style="border-top:none">DATE</td>
  <td class="xl85" style="border-top:none">&nbsp;</td>
  <td class="xl92" style="border-top:none">24-Feb-24</td>
  <td class="xl84" style="border-top:none;border-left:none">DATE</td>
  <td class="xl93" style="border-top:none;border-left:none">24-Feb-24</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl97" style="height:15.0pt;border-top:none">PAID BY</td>
  <td class="xl98" style="border-top:none;border-left:none">CARD</td>
  <td class="xl99" style="border-top:none">UTC</td>
  <td class="xl100" style="border-top:none">&nbsp;</td>
  <td class="xl101" style="border-top:none">12:00</td>
  <td class="xl99" style="border-top:none;border-left:none">UTC</td>
  <td class="xl102" style="border-top:none;border-left:none">11:00</td>
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
  none">28.00</td>
  <td colspan="2" rowspan="2" class="xl116" style="border-right:1.0pt solid black;
  border-bottom:1.0pt solid black">28.00</td>
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
 <tr height="19" style="height:14.4pt">
  <td colspan="5" height="19" class="xl109" style="border-right:1.0pt solid black;
  height:14.4pt">Additional services</td>
  <td class="xl113">&nbsp;</td>
  <td colspan="2" class="xl126" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
  <td colspan="2" class="xl114" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl128" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl129" style="border-right:1.0pt solid black">Documents
  printing and delivery</td>
  <td class="xl133" style="border-top:none">1</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">10.00</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">10.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl128" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl129" style="border-right:1.0pt solid black">Crew
  transportation on the apron</td>
  <td class="xl133" style="border-top:none">0</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl128" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl136" style="border-right:1.0pt solid black">Passenger
  transportation on the apron</td>
  <td class="xl133" style="border-top:none">0</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl128" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl129" style="border-right:1.0pt solid black">Landing
  permit</td>
  <td class="xl133" style="border-top:none">0</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl128" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl129" style="border-right:1.0pt solid black">GPU (up to
  30min)</td>
  <td class="xl133" style="border-top:none">0</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl128" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl140" style="border-right:1.0pt solid black">Toilet
  service</td>
  <td class="xl133" style="border-top:none">0</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl128" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl129" style="border-right:1.0pt solid black">Water
  service</td>
  <td class="xl133" style="border-top:none">0</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl144" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Dishwashing</td>
  <td class="xl147" style="border-top:none">0</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl144" style="height:14.4pt">&nbsp;</td>
  <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Laundry</td>
  <td class="xl89">0</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl144" style="height:14.4pt">&nbsp;</td>
  <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Meet and
  assist</td>
  <td class="xl147">0</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl144" style="height:14.4pt">&nbsp;</td>
  <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Hotel
  transportation</td>
  <td class="xl147">0</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl144" style="height:14.4pt">&nbsp;</td>
  <td colspan="4" class="xl148" style="border-right:1.0pt solid black">Express/VIP
  Terminal</td>
  <td class="xl147">0</td>
  <td colspan="2" class="xl150" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
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
 <tr height="19" style="height:14.4pt">
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
  <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Airport fees</td>
  <td class="xl135" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
  <td colspan="2" class="xl161" style="border-right:1.0pt solid black;border-left:
  none">15.51</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl160" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Catering</td>
  <td class="xl133" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
  <td colspan="2" class="xl161" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
 <tr height="19" style="height:14.4pt">
  <td height="19" class="xl160" style="height:14.4pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl145" style="border-right:1.0pt solid black">Fuel</td>
  <td class="xl163" style="border-top:none">&nbsp;</td>
  <td colspan="2" class="xl134" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
  <td colspan="2" class="xl164" width="128" style="border-right:1.0pt solid black;
  border-left:none;width:96pt">0.00</td>
 </tr>
 <tr height="20" style="height:15.0pt">
  <td height="20" class="xl166" style="height:15.0pt;border-top:none">&nbsp;</td>
  <td colspan="4" class="xl148" style="border-right:1.0pt solid black">HOTAC</td>
  <td class="xl167" style="border-top:none;border-left:none">&nbsp;</td>
  <td colspan="2" class="xl122" style="border-right:1.0pt solid black;border-left:
  none">&nbsp;</td>
  <td colspan="2" class="xl161" style="border-right:1.0pt solid black;border-left:
  none">0.00</td>
 </tr>
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
  <td height="20" class="xl184" colspan="2" style="height:15.0pt;mso-ignore:colspan">Billing
  to:</td>
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
 <tr height="20" style="height:15.0pt">
 </tr>
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
  <td height="19" class="xl184" colspan="4" style="height:14.4pt;mso-ignore:colspan">Name
  and signature of handling agent</td>
  <td class="xl223" style="border-top:none">&nbsp;</td>
  <td class="xl224" colspan="5" style="mso-ignore:colspan;border-right:1.0pt solid black">Name
  and signature of Crew/Carrier representativ<span style="display:none">e</span></td>
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




</body></html>
`;

export default function App() {
  const [selectedPrinter, setSelectedPrinter] = React.useState<any>();

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log("File has been saved to:", uri);

    try {
      const contentUri = await FileSystem.getContentUriAsync(uri);
      if (Platform.OS === "ios") {
        await shareAsync(contentUri);
      } else {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
          type: "application/pdf",
        });
      }
    } catch (e) {
      console.error(e);
    }

    // await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  return (
    <View style={styles.container}>
      <Button title="Print" onPress={print} />
      <View style={styles.spacer} />
      <Button title="Print to PDF file" onPress={printToFile} />
      {Platform.OS === "ios" && (
        <>
          <View style={styles.spacer} />
          <Button title="Select printer" onPress={selectPrinter} />
          <View style={styles.spacer} />
          {selectedPrinter ? (
            <Text
              style={styles.printer}
            >{`Selected printer: ${selectedPrinter.name}`}</Text>
          ) : undefined}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    flexDirection: "column",
    padding: 8,
  },
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: "center",
  },
});
