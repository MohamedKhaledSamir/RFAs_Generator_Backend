require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const dotenv = require("dotenv");

dotenv.config();

const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const { PDFDocument } = require("pdf-lib");

const axios = require("axios");

const { readFile } = require("fs/promises");




// Create Express app

const app = express();

app.use(express.json({ limit: "20mb" }));

app.use(cors());

const fCodes = [
  {
    code: "F0150",
    description: "Vascular dementia, unsp severity, without beh/psych/mood/anx",
  },
  {
    code: "F0151",
    description: "Vascular dementia with behavioral disturbance",
  },
  {
    code: "F01511",
    description: "Vascular dementia, unspecified severity, with agitation",
  },
  {
    code: "F01518",
    description: "Vascular dementia, unsp severity, with other beh disturb",
  },
  {
    code: "F0152",
    description: "Vascular dementia, unsp severity, with psychotic disturb",
  },
  {
    code: "F0153",
    description: "Vascular dementia, unspecified severity, with mood disturb",
  },
  {
    code: "F0154",
    description: "Vascular dementia, unspecified severity, with anxiety",
  },
  {
    code: "F01A0",
    description: "Vascular dementia, mild, without beh/psych/mood/anx",
  },
  { code: "F01A11", description: "Vascular dementia, mild, with agitation" },
  {
    code: "F01A18",
    description: "Vascular dementia, mild, with other behavioral disturbance",
  },
  {
    code: "F01A2",
    description: "Vascular dementia, mild, with psychotic disturbance",
  },
  {
    code: "F01A3",
    description: "Vascular dementia, mild, with mood disturbance",
  },
  { code: "F01A4", description: "Vascular dementia, mild, with anxiety" },
  {
    code: "F01B0",
    description: "Vascular dementia, moderate, without beh/psych/mood/anx",
  },
  {
    code: "F01B11",
    description: "Vascular dementia, moderate, with agitation",
  },
  {
    code: "F01B18",
    description: "Vascular dementia, moderate, with other behavioral disturb",
  },
  {
    code: "F01B2",
    description: "Vascular dementia, moderate, with psychotic disturbance",
  },
  {
    code: "F01B3",
    description: "Vascular dementia, moderate, with mood disturbance",
  },
  { code: "F01B4", description: "Vascular dementia, moderate, with anxiety" },
  {
    code: "F01C0",
    description: "Vascular dementia, severe, without beh/psych/mood/anx",
  },
  { code: "F01C11", description: "Vascular dementia, severe, with agitation" },
  {
    code: "F01C18",
    description: "Vascular dementia, severe, with other behavioral disturbance",
  },
  {
    code: "F01C2",
    description: "Vascular dementia, severe, with psychotic disturbance",
  },
  {
    code: "F01C3",
    description: "Vascular dementia, severe, with mood disturbance",
  },
  { code: "F01C4", description: "Vascular dementia, severe, with anxiety" },
  {
    code: "F0280",
    description:
      "Dem in oth dis classd elswhr, unsp sev, w/o beh/psych/mood/anx",
  },
  {
    code: "F0281",
    description: "Dementia in oth diseases classd elswhr w behavioral disturb",
  },
  {
    code: "F02811",
    description: "Dem in other dis classd elswhr, unsp severt, with agitation",
  },
  {
    code: "F02818",
    description: "Dem in oth dis classd elswhr, unsp sev, with oth beh distrb",
  },
  {
    code: "F0282",
    description: "Dem in other dis classd elswhr, unsp sev, with psych distrb",
  },
  {
    code: "F0283",
    description: "Dem in other dis classd elswhr, unsp sev, with mood distrb",
  },
  {
    code: "F0284",
    description: "Dem in other dis classd elswhr, unsp severity, with anxiety",
  },
  {
    code: "F02A0",
    description: "Dem in other dis classd elswhr, mild, w/o beh/psych/mood/anx",
  },
  {
    code: "F02A11",
    description: "Dem in other diseases classd elswhr, mild, with agitation",
  },
  {
    code: "F02A18",
    description: "Dem in other dis classd elswhr, mild, with other beh distrb",
  },
  {
    code: "F02A2",
    description: "Dem in other dis classd elswhr, mild, with psych disturb",
  },
  {
    code: "F02A3",
    description: "Dem in other diseases classd elswhr, mild, with mood disturb",
  },
  {
    code: "F02A4",
    description: "Dementia in other diseases classd elswhr, mild, with anxiety",
  },
  {
    code: "F02B0",
    description: "Dem in other dis classd elswhr, mod, w/o beh/psych/mood/anx",
  },
  {
    code: "F02B11",
    description: "Dem in other dis classd elswhr, moderate, with agitation",
  },
  {
    code: "F02B18",
    description: "Dem in other dis classd elswhr, mod, with other beh disturb",
  },
  {
    code: "F02B2",
    description: "Dem in other dis classd elswhr, moderate, with psych disturb",
  },
  {
    code: "F02B3",
    description: "Dem in other dis classd elswhr, moderate, with mood disturb",
  },
  {
    code: "F02B4",
    description: "Dem in other diseases classd elswhr, moderate, with anxiety",
  },
  {
    code: "F02C0",
    description: "Dem in other dis classd elswhr, sev, w/o beh/psych/mood/anx",
  },
  {
    code: "F02C11",
    description: "Dem in other diseases classd elswhr, severe, with agitation",
  },
  {
    code: "F02C18",
    description: "Dem in other dis classd elswhr, sev, with other beh distrb",
  },
  {
    code: "F02C2",
    description: "Dem in other dis classd elswhr, severe, with psych disturb",
  },
  {
    code: "F02C3",
    description: "Dem in other dis classd elswhr, severe, with mood disturb",
  },
  {
    code: "F02C4",
    description: "Dem in other diseases classd elswhr, severe, with anxiety",
  },
  {
    code: "F0390",
    description: "Unsp dementia, unsp severity, without beh/psych/mood/anx",
  },
  {
    code: "F0391",
    description: "Unspecified dementia with behavioral disturbance",
  },
  {
    code: "F03911",
    description: "Unspecified dementia, unspecified severity, with agitation",
  },
  {
    code: "F03918",
    description: "Unsp dementia, unsp severity, with other behavioral disturb",
  },
  {
    code: "F0392",
    description: "Unsp dementia, unspecified severity, with psychotic disturb",
  },
  {
    code: "F0393",
    description: "Unsp dementia, unspecified severity, with mood disturb",
  },
  {
    code: "F0394",
    description: "Unspecified dementia, unspecified severity, with anxiety",
  },
  {
    code: "F03A0",
    description: "Unspecified dementia, mild, without beh/psych/mood/anx",
  },
  { code: "F03A11", description: "Unspecified dementia, mild, with agitation" },
  {
    code: "F03A18",
    description: "Unspecified dementia, mild, with other behavioral disturb",
  },
  {
    code: "F03A2",
    description: "Unspecified dementia, mild, with psychotic disturbance",
  },
  {
    code: "F03A3",
    description: "Unspecified dementia, mild, with mood disturbance",
  },
  { code: "F03A4", description: "Unspecified dementia, mild, with anxiety" },
  {
    code: "F03B0",
    description: "Unspecified dementia, moderate, without beh/psych/mood/anx",
  },
  {
    code: "F03B11",
    description: "Unspecified dementia, moderate, with agitation",
  },
  {
    code: "F03B18",
    description: "Unsp dementia, moderate, with other behavioral disturb",
  },
  {
    code: "F03B2",
    description: "Unspecified dementia, moderate, with psychotic disturbance",
  },
  {
    code: "F03B3",
    description: "Unspecified dementia, moderate, with mood disturbance",
  },
  {
    code: "F03B4",
    description: "Unspecified dementia, moderate, with anxiety",
  },
  {
    code: "F03C0",
    description: "Unspecified dementia, severe, without beh/psych/mood/anx",
  },
  {
    code: "F03C11",
    description: "Unspecified dementia, severe, with agitation",
  },
  {
    code: "F03C18",
    description: "Unspecified dementia, severe, with other behavioral disturb",
  },
  {
    code: "F03C2",
    description: "Unspecified dementia, severe, with psychotic disturbance",
  },
  {
    code: "F03C3",
    description: "Unspecified dementia, severe, with mood disturbance",
  },
  { code: "F03C4", description: "Unspecified dementia, severe, with anxiety" },
  {
    code: "F04",
    description: "Amnestic disorder due to known physiological condition",
  },
  { code: "F05", description: "Delirium due to known physiological condition" },
  {
    code: "F060",
    description: "Psychotic disorder w hallucin due to known physiol condition",
  },
  {
    code: "F061",
    description: "Catatonic disorder due to known physiological condition",
  },
  {
    code: "F062",
    description: "Psychotic disorder w delusions due to known physiol cond",
  },
  {
    code: "F0630",
    description: "Mood disorder due to known physiological condition, unsp",
  },
  {
    code: "F0631",
    description: "Mood disorder due to known physiol cond w depressv features",
  },
  {
    code: "F0632",
    description: "Mood disord d/t physiol cond w major depressive-like epsd",
  },
  {
    code: "F0633",
    description: "Mood disorder due to known physiol cond w manic features",
  },
  {
    code: "F0634",
    description: "Mood disorder due to known physiol cond w mixed features",
  },
  {
    code: "F064",
    description: "Anxiety disorder due to known physiological condition",
  },
  {
    code: "F0670",
    description: "Mild neurocog disord d/t known physiol cond w/o beh distrb",
  },
  {
    code: "F0671",
    description: "Mild neurocog disord d/t known physiol cond with beh distrb",
  },
  {
    code: "F068",
    description: "Oth mental disorders due to known physiological condition",
  },
  {
    code: "F070",
    description: "Personality change due to known physiological condition",
  },
  { code: "F0781", description: "Postconcussional syndrome" },
  {
    code: "F0789",
    description: "Oth personality & behavrl disord due to known physiol cond",
  },
  {
    code: "F079",
    description: "Unsp personality & behavrl disord due to known physiol cond",
  },
  {
    code: "F09",
    description: "Unsp mental disorder due to known physiological condition",
  },
  { code: "F1010", description: "Alcohol abuse, uncomplicated" },
  { code: "F1011", description: "Alcohol abuse, in remission" },
  {
    code: "F10120",
    description: "Alcohol abuse with intoxication, uncomplicated",
  },
  { code: "F10121", description: "Alcohol abuse with intoxication delirium" },
  {
    code: "F10129",
    description: "Alcohol abuse with intoxication, unspecified",
  },
  {
    code: "F10130",
    description: "Alcohol abuse with withdrawal, uncomplicated",
  },
  { code: "F10131", description: "Alcohol abuse with withdrawal delirium" },
  {
    code: "F10132",
    description: "Alcohol abuse with withdrawal with perceptual disturbance",
  },
  { code: "F10139", description: "Alcohol abuse with withdrawal, unspecified" },
  {
    code: "F1014",
    description: "Alcohol abuse with alcohol-induced mood disorder",
  },
  {
    code: "F10150",
    description: "Alcohol abuse w alcoh-induce psychotic disorder w delusions",
  },
  {
    code: "F10151",
    description: "Alcohol abuse w alcoh-induce psychotic disorder w hallucin",
  },
  {
    code: "F10159",
    description: "Alcohol abuse with alcohol-induced psychotic disorder, unsp",
  },
  {
    code: "F10180",
    description: "Alcohol abuse with alcohol-induced anxiety disorder",
  },
  {
    code: "F10181",
    description: "Alcohol abuse with alcohol-induced sexual dysfunction",
  },
  {
    code: "F10182",
    description: "Alcohol abuse with alcohol-induced sleep disorder",
  },
  {
    code: "F10188",
    description: "Alcohol abuse with other alcohol-induced disorder",
  },
  {
    code: "F1019",
    description: "Alcohol abuse with unspecified alcohol-induced disorder",
  },
  { code: "F1020", description: "Alcohol dependence, uncomplicated" },
  { code: "F1021", description: "Alcohol dependence, in remission" },
  {
    code: "F10220",
    description: "Alcohol dependence with intoxication, uncomplicated",
  },
  {
    code: "F10221",
    description: "Alcohol dependence with intoxication delirium",
  },
  {
    code: "F10229",
    description: "Alcohol dependence with intoxication, unspecified",
  },
  {
    code: "F10230",
    description: "Alcohol dependence with withdrawal, uncomplicated",
  },
  {
    code: "F10231",
    description: "Alcohol dependence with withdrawal delirium",
  },
  {
    code: "F10232",
    description: "Alcohol dependence w withdrawal with perceptual disturbance",
  },
  {
    code: "F10239",
    description: "Alcohol dependence with withdrawal, unspecified",
  },
  {
    code: "F1024",
    description: "Alcohol dependence with alcohol-induced mood disorder",
  },
  {
    code: "F10250",
    description: "Alcohol depend w alcoh-induce psychotic disorder w delusions",
  },
  {
    code: "F10251",
    description: "Alcohol depend w alcoh-induce psychotic disorder w hallucin",
  },
  {
    code: "F10259",
    description: "Alcohol dependence w alcoh-induce psychotic disorder, unsp",
  },
  {
    code: "F1026",
    description: "Alcohol depend w alcoh-induce persisting amnestic disorder",
  },
  {
    code: "F1027",
    description: "Alcohol dependence with alcohol-induced persisting dementia",
  },
  {
    code: "F10280",
    description: "Alcohol dependence with alcohol-induced anxiety disorder",
  },
  {
    code: "F10281",
    description: "Alcohol dependence with alcohol-induced sexual dysfunction",
  },
  {
    code: "F10282",
    description: "Alcohol dependence with alcohol-induced sleep disorder",
  },
  {
    code: "F10288",
    description: "Alcohol dependence with other alcohol-induced disorder",
  },
  {
    code: "F1029",
    description: "Alcohol dependence with unspecified alcohol-induced disorder",
  },
  { code: "F1090", description: "Alcohol use, unspecified, uncomplicated" },
  { code: "F1091", description: "Alcohol use, unspecified, in remission" },
  {
    code: "F10920",
    description: "Alcohol use, unspecified with intoxication, uncomplicated",
  },
  {
    code: "F10921",
    description: "Alcohol use, unspecified with intoxication delirium",
  },
  {
    code: "F10929",
    description: "Alcohol use, unspecified with intoxication, unspecified",
  },
  {
    code: "F10930",
    description: "Alcohol use, unspecified with withdrawal, uncomplicated",
  },
  {
    code: "F10931",
    description: "Alcohol use, unspecified with withdrawal delirium",
  },
  {
    code: "F10932",
    description: "Alcohol use, unspecified with w/drawal w perceptual disturb",
  },
  {
    code: "F10939",
    description: "Alcohol use, unspecified with withdrawal, unspecified",
  },
  {
    code: "F1094",
    description: "Alcohol use, unspecified with alcohol-induced mood disorder",
  },
  {
    code: "F10950",
    description: "Alcohol use, unsp w alcoh-induce psych disorder w delusions",
  },
  {
    code: "F10951",
    description: "Alcohol use, unsp w alcoh-induce psych disorder w hallucin",
  },
  {
    code: "F10959",
    description: "Alcohol use, unsp w alcohol-induced psychotic disorder, unsp",
  },
  {
    code: "F1096",
    description: "Alcohol use, unsp w alcoh-induce persist amnestic disorder",
  },
  {
    code: "F1097",
    description: "Alcohol use, unsp with alcohol-induced persisting dementia",
  },
  {
    code: "F10980",
    description: "Alcohol use, unsp with alcohol-induced anxiety disorder",
  },
  {
    code: "F10981",
    description: "Alcohol use, unsp with alcohol-induced sexual dysfunction",
  },
  {
    code: "F10982",
    description: "Alcohol use, unspecified with alcohol-induced sleep disorder",
  },
  {
    code: "F10988",
    description: "Alcohol use, unspecified with other alcohol-induced disorder",
  },
  {
    code: "F1099",
    description: "Alcohol use, unsp with unspecified alcohol-induced disorder",
  },
  { code: "F1110", description: "Opioid abuse, uncomplicated" },
  { code: "F1111", description: "Opioid abuse, in remission" },
  {
    code: "F11120",
    description: "Opioid abuse with intoxication, uncomplicated",
  },
  { code: "F11121", description: "Opioid abuse with intoxication delirium" },
  {
    code: "F11122",
    description: "Opioid abuse with intoxication with perceptual disturbance",
  },
  {
    code: "F11129",
    description: "Opioid abuse with intoxication, unspecified",
  },
  { code: "F1113", description: "Opioid abuse with withdrawal" },
  {
    code: "F1114",
    description: "Opioid abuse with opioid-induced mood disorder",
  },
  {
    code: "F11150",
    description: "Opioid abuse w opioid-induced psychotic disorder w delusions",
  },
  {
    code: "F11151",
    description: "Opioid abuse w opioid-induced psychotic disorder w hallucin",
  },
  {
    code: "F11159",
    description: "Opioid abuse with opioid-induced psychotic disorder, unsp",
  },
  {
    code: "F11181",
    description: "Opioid abuse with opioid-induced sexual dysfunction",
  },
  {
    code: "F11182",
    description: "Opioid abuse with opioid-induced sleep disorder",
  },
  {
    code: "F11188",
    description: "Opioid abuse with other opioid-induced disorder",
  },
  {
    code: "F1119",
    description: "Opioid abuse with unspecified opioid-induced disorder",
  },
  { code: "F1120", description: "Opioid dependence, uncomplicated" },
  { code: "F1121", description: "Opioid dependence, in remission" },
  {
    code: "F11220",
    description: "Opioid dependence with intoxication, uncomplicated",
  },
  {
    code: "F11221",
    description: "Opioid dependence with intoxication delirium",
  },
  {
    code: "F11222",
    description: "Opioid dependence w intoxication with perceptual disturbance",
  },
  {
    code: "F11229",
    description: "Opioid dependence with intoxication, unspecified",
  },
  { code: "F1123", description: "Opioid dependence with withdrawal" },
  {
    code: "F1124",
    description: "Opioid dependence with opioid-induced mood disorder",
  },
  {
    code: "F11250",
    description: "Opioid depend w opioid-induc psychotic disorder w delusions",
  },
  {
    code: "F11251",
    description: "Opioid depend w opioid-induc psychotic disorder w hallucin",
  },
  {
    code: "F11259",
    description: "Opioid dependence w opioid-induced psychotic disorder, unsp",
  },
  {
    code: "F11281",
    description: "Opioid dependence with opioid-induced sexual dysfunction",
  },
  {
    code: "F11282",
    description: "Opioid dependence with opioid-induced sleep disorder",
  },
  {
    code: "F11288",
    description: "Opioid dependence with other opioid-induced disorder",
  },
  {
    code: "F1129",
    description: "Opioid dependence with unspecified opioid-induced disorder",
  },
  { code: "F1190", description: "Opioid use, unspecified, uncomplicated" },
  { code: "F1191", description: "Opioid use, unspecified, in remission" },
  {
    code: "F11920",
    description: "Opioid use, unspecified with intoxication, uncomplicated",
  },
  {
    code: "F11921",
    description: "Opioid use, unspecified with intoxication delirium",
  },
  {
    code: "F11922",
    description: "Opioid use, unsp w intoxication with perceptual disturbance",
  },
  {
    code: "F11929",
    description: "Opioid use, unspecified with intoxication, unspecified",
  },
  { code: "F1193", description: "Opioid use, unspecified with withdrawal" },
  {
    code: "F1194",
    description: "Opioid use, unspecified with opioid-induced mood disorder",
  },
  {
    code: "F11950",
    description: "Opioid use, unsp w opioid-induc psych disorder w delusions",
  },
  {
    code: "F11951",
    description: "Opioid use, unsp w opioid-induc psych disorder w hallucin",
  },
  {
    code: "F11959",
    description: "Opioid use, unsp w opioid-induced psychotic disorder, unsp",
  },
  {
    code: "F11981",
    description: "Opioid use, unsp with opioid-induced sexual dysfunction",
  },
  {
    code: "F11982",
    description: "Opioid use, unspecified with opioid-induced sleep disorder",
  },
  {
    code: "F11988",
    description: "Opioid use, unspecified with other opioid-induced disorder",
  },
  {
    code: "F1199",
    description: "Opioid use, unsp with unspecified opioid-induced disorder",
  },
  { code: "F1210", description: "Cannabis abuse, uncomplicated" },
  { code: "F1211", description: "Cannabis abuse, in remission" },
  {
    code: "F12120",
    description: "Cannabis abuse with intoxication, uncomplicated",
  },
  { code: "F12121", description: "Cannabis abuse with intoxication delirium" },
  {
    code: "F12122",
    description: "Cannabis abuse with intoxication with perceptual disturbance",
  },
  {
    code: "F12129",
    description: "Cannabis abuse with intoxication, unspecified",
  },
  { code: "F1213", description: "Cannabis abuse with withdrawal" },
  {
    code: "F12150",
    description: "Cannabis abuse with psychotic disorder with delusions",
  },
  {
    code: "F12151",
    description: "Cannabis abuse with psychotic disorder with hallucinations",
  },
  {
    code: "F12159",
    description: "Cannabis abuse with psychotic disorder, unspecified",
  },
  {
    code: "F12180",
    description: "Cannabis abuse with cannabis-induced anxiety disorder",
  },
  {
    code: "F12188",
    description: "Cannabis abuse with other cannabis-induced disorder",
  },
  {
    code: "F1219",
    description: "Cannabis abuse with unspecified cannabis-induced disorder",
  },
  { code: "F1220", description: "Cannabis dependence, uncomplicated" },
  { code: "F1221", description: "Cannabis dependence, in remission" },
  {
    code: "F12220",
    description: "Cannabis dependence with intoxication, uncomplicated",
  },
  {
    code: "F12221",
    description: "Cannabis dependence with intoxication delirium",
  },
  {
    code: "F12222",
    description: "Cannabis dependence w intoxication w perceptual disturbance",
  },
  {
    code: "F12229",
    description: "Cannabis dependence with intoxication, unspecified",
  },
  { code: "F1223", description: "Cannabis dependence with withdrawal" },
  {
    code: "F12250",
    description: "Cannabis dependence with psychotic disorder with delusions",
  },
  {
    code: "F12251",
    description: "Cannabis dependence w psychotic disorder with hallucinations",
  },
  {
    code: "F12259",
    description: "Cannabis dependence with psychotic disorder, unspecified",
  },
  {
    code: "F12280",
    description: "Cannabis dependence with cannabis-induced anxiety disorder",
  },
  {
    code: "F12288",
    description: "Cannabis dependence with other cannabis-induced disorder",
  },
  {
    code: "F1229",
    description: "Cannabis dependence with unsp cannabis-induced disorder",
  },
  { code: "F1290", description: "Cannabis use, unspecified, uncomplicated" },
  { code: "F1291", description: "Cannabis use, unspecified, in remission" },
  {
    code: "F12920",
    description: "Cannabis use, unspecified with intoxication, uncomplicated",
  },
  {
    code: "F12921",
    description: "Cannabis use, unspecified with intoxication delirium",
  },
  {
    code: "F12922",
    description: "Cannabis use, unsp w intoxication w perceptual disturbance",
  },
  {
    code: "F12929",
    description: "Cannabis use, unspecified with intoxication, unspecified",
  },
  { code: "F1293", description: "Cannabis use, unspecified with withdrawal" },
  {
    code: "F12950",
    description: "Cannabis use, unsp with psychotic disorder with delusions",
  },
  {
    code: "F12951",
    description: "Cannabis use, unsp w psychotic disorder with hallucinations",
  },
  {
    code: "F12959",
    description: "Cannabis use, unsp with psychotic disorder, unspecified",
  },
  {
    code: "F12980",
    description: "Cannabis use, unspecified with anxiety disorder",
  },
  {
    code: "F12988",
    description: "Cannabis use, unsp with other cannabis-induced disorder",
  },
  {
    code: "F1299",
    description: "Cannabis use, unsp with unsp cannabis-induced disorder",
  },
  {
    code: "F1310",
    description: "Sedative, hypnotic or anxiolytic abuse, uncomplicated",
  },
  {
    code: "F1311",
    description: "Sedative, hypnotic or anxiolytic abuse, in remission",
  },
  {
    code: "F13120",
    description: "Sedatv/hyp/anxiolytc abuse w intoxication, uncomplicated",
  },
  {
    code: "F13121",
    description: "Sedatv/hyp/anxiolytc abuse w intoxication delirium",
  },
  {
    code: "F13129",
    description: "Sedative, hypnotic or anxiolytic abuse w intoxication, unsp",
  },
  {
    code: "F13130",
    description: "Sedatv/hyp/anxiolytc abuse with withdrawal, uncomplicated",
  },
  {
    code: "F13131",
    description: "Sedatv/hyp/anxiolytc abuse with withdrawal delirium",
  },
  {
    code: "F13132",
    description: "Sedatv/hyp/anxiolytc abuse with w/drawal w perceptl disturb",
  },
  {
    code: "F13139",
    description: "Sedatv/hyp/anxiolytc abuse with withdrawal, unspecified",
  },
  {
    code: "F1314",
    description: "Sedative, hypnotic or anxiolytic abuse w mood disorder",
  },
  {
    code: "F13150",
    description: "Sedatv/hyp/anxiolytc abuse w psychotic disorder w delusions",
  },
  {
    code: "F13151",
    description: "Sedatv/hyp/anxiolytc abuse w psychotic disorder w hallucin",
  },
  {
    code: "F13159",
    description: "Sedatv/hyp/anxiolytc abuse w psychotic disorder, unsp",
  },
  {
    code: "F13180",
    description: "Sedative, hypnotic or anxiolytic abuse w anxiety disorder",
  },
  {
    code: "F13181",
    description: "Sedative, hypnotic or anxiolytic abuse w sexual dysfunction",
  },
  {
    code: "F13182",
    description: "Sedative, hypnotic or anxiolytic abuse w sleep disorder",
  },
  {
    code: "F13188",
    description: "Sedative, hypnotic or anxiolytic abuse w oth disorder",
  },
  {
    code: "F1319",
    description: "Sedative, hypnotic or anxiolytic abuse w unsp disorder",
  },
  {
    code: "F1320",
    description: "Sedative, hypnotic or anxiolytic dependence, uncomplicated",
  },
  {
    code: "F1321",
    description: "Sedative, hypnotic or anxiolytic dependence, in remission",
  },
  {
    code: "F13220",
    description: "Sedatv/hyp/anxiolytc dependence w intoxication, uncomp",
  },
  {
    code: "F13221",
    description: "Sedatv/hyp/anxiolytc dependence w intoxication delirium",
  },
  {
    code: "F13229",
    description: "Sedatv/hyp/anxiolytc dependence w intoxication, unsp",
  },
  {
    code: "F13230",
    description: "Sedatv/hyp/anxiolytc dependence w withdrawal, uncomplicated",
  },
  {
    code: "F13231",
    description: "Sedatv/hyp/anxiolytc dependence w withdrawal delirium",
  },
  {
    code: "F13232",
    description: "Sedatv/hyp/anxiolytc depend w w/drawal w perceptual disturb",
  },
  {
    code: "F13239",
    description: "Sedatv/hyp/anxiolytc dependence w withdrawal, unsp",
  },
  {
    code: "F1324",
    description: "Sedative, hypnotic or anxiolytic dependence w mood disorder",
  },
  {
    code: "F13250",
    description: "Sedatv/hyp/anxiolytc depend w psychotic disorder w delusions",
  },
  {
    code: "F13251",
    description: "Sedatv/hyp/anxiolytc depend w psychotic disorder w hallucin",
  },
  {
    code: "F13259",
    description: "Sedatv/hyp/anxiolytc dependence w psychotic disorder, unsp",
  },
  {
    code: "F1326",
    description: "Sedatv/hyp/anxiolytc depend w persisting amnestic disorder",
  },
  {
    code: "F1327",
    description: "Sedatv/hyp/anxiolytc dependence w persisting dementia",
  },
  {
    code: "F13280",
    description: "Sedatv/hyp/anxiolytc dependence w anxiety disorder",
  },
  {
    code: "F13281",
    description: "Sedatv/hyp/anxiolytc dependence w sexual dysfunction",
  },
  {
    code: "F13282",
    description: "Sedative, hypnotic or anxiolytic dependence w sleep disorder",
  },
  {
    code: "F13288",
    description: "Sedative, hypnotic or anxiolytic dependence w oth disorder",
  },
  {
    code: "F1329",
    description: "Sedative, hypnotic or anxiolytic dependence w unsp disorder",
  },
  {
    code: "F1390",
    description: "Sedative, hypnotic, or anxiolytic use, unsp, uncomplicated",
  },
  {
    code: "F1391",
    description: "Sedatv/hyp/anxiolytc use, unspecified, in remission",
  },
  {
    code: "F13920",
    description: "Sedatv/hyp/anxiolytc use, unsp w intoxication, uncomplicated",
  },
  {
    code: "F13921",
    description: "Sedatv/hyp/anxiolytc use, unsp w intoxication delirium",
  },
  {
    code: "F13929",
    description: "Sedatv/hyp/anxiolytc use, unsp w intoxication, unsp",
  },
  {
    code: "F13930",
    description: "Sedatv/hyp/anxiolytc use, unsp w withdrawal, uncomplicated",
  },
  {
    code: "F13931",
    description: "Sedatv/hyp/anxiolytc use, unsp w withdrawal delirium",
  },
  {
    code: "F13932",
    description: "Sedatv/hyp/anxiolytc use, unsp w w/drawal w perceptl disturb",
  },
  {
    code: "F13939",
    description: "Sedatv/hyp/anxiolytc use, unsp w withdrawal, unsp",
  },
  {
    code: "F1394",
    description: "Sedative, hypnotic or anxiolytic use, unsp w mood disorder",
  },
  {
    code: "F13950",
    description: "Sedatv/hyp/anxiolytc use, unsp w psych disorder w delusions",
  },
  {
    code: "F13951",
    description: "Sedatv/hyp/anxiolytc use, unsp w psych disorder w hallucin",
  },
  {
    code: "F13959",
    description: "Sedatv/hyp/anxiolytc use, unsp w psychotic disorder, unsp",
  },
  {
    code: "F1396",
    description: "Sedatv/hyp/anxiolytc use, unsp w persist amnestic disorder",
  },
  {
    code: "F1397",
    description: "Sedatv/hyp/anxiolytc use, unsp w persisting dementia",
  },
  {
    code: "F13980",
    description: "Sedatv/hyp/anxiolytc use, unsp w anxiety disorder",
  },
  {
    code: "F13981",
    description: "Sedatv/hyp/anxiolytc use, unsp w sexual dysfunction",
  },
  {
    code: "F13982",
    description: "Sedative, hypnotic or anxiolytic use, unsp w sleep disorder",
  },
  {
    code: "F13988",
    description: "Sedative, hypnotic or anxiolytic use, unsp w oth disorder",
  },
  {
    code: "F1399",
    description: "Sedative, hypnotic or anxiolytic use, unsp w unsp disorder",
  },
  { code: "F1410", description: "Cocaine abuse, uncomplicated" },
  { code: "F1411", description: "Cocaine abuse, in remission" },
  {
    code: "F14120",
    description: "Cocaine abuse with intoxication, uncomplicated",
  },
  {
    code: "F14121",
    description: "Cocaine abuse with intoxication with delirium",
  },
  {
    code: "F14122",
    description: "Cocaine abuse with intoxication with perceptual disturbance",
  },
  {
    code: "F14129",
    description: "Cocaine abuse with intoxication, unspecified",
  },
  { code: "F1413", description: "Cocaine abuse, unspecified with withdrawal" },
  {
    code: "F1414",
    description: "Cocaine abuse with cocaine-induced mood disorder",
  },
  {
    code: "F14150",
    description: "Cocaine abuse w cocaine-induc psychotic disorder w delusions",
  },
  {
    code: "F14151",
    description: "Cocaine abuse w cocaine-induc psychotic disorder w hallucin",
  },
  {
    code: "F14159",
    description: "Cocaine abuse with cocaine-induced psychotic disorder, unsp",
  },
  {
    code: "F14180",
    description: "Cocaine abuse with cocaine-induced anxiety disorder",
  },
  {
    code: "F14181",
    description: "Cocaine abuse with cocaine-induced sexual dysfunction",
  },
  {
    code: "F14182",
    description: "Cocaine abuse with cocaine-induced sleep disorder",
  },
  {
    code: "F14188",
    description: "Cocaine abuse with other cocaine-induced disorder",
  },
  {
    code: "F1419",
    description: "Cocaine abuse with unspecified cocaine-induced disorder",
  },
  { code: "F1420", description: "Cocaine dependence, uncomplicated" },
  { code: "F1421", description: "Cocaine dependence, in remission" },
  {
    code: "F14220",
    description: "Cocaine dependence with intoxication, uncomplicated",
  },
  {
    code: "F14221",
    description: "Cocaine dependence with intoxication delirium",
  },
  {
    code: "F14222",
    description: "Cocaine dependence w intoxication w perceptual disturbance",
  },
  {
    code: "F14229",
    description: "Cocaine dependence with intoxication, unspecified",
  },
  { code: "F1423", description: "Cocaine dependence with withdrawal" },
  {
    code: "F1424",
    description: "Cocaine dependence with cocaine-induced mood disorder",
  },
  {
    code: "F14250",
    description: "Cocaine depend w cocaine-induc psych disorder w delusions",
  },
  {
    code: "F14251",
    description: "Cocaine depend w cocaine-induc psychotic disorder w hallucin",
  },
  {
    code: "F14259",
    description: "Cocaine dependence w cocaine-induc psychotic disorder, unsp",
  },
  {
    code: "F14280",
    description: "Cocaine dependence with cocaine-induced anxiety disorder",
  },
  {
    code: "F14281",
    description: "Cocaine dependence with cocaine-induced sexual dysfunction",
  },
  {
    code: "F14282",
    description: "Cocaine dependence with cocaine-induced sleep disorder",
  },
  {
    code: "F14288",
    description: "Cocaine dependence with other cocaine-induced disorder",
  },
  {
    code: "F1429",
    description: "Cocaine dependence with unspecified cocaine-induced disorder",
  },
  { code: "F1490", description: "Cocaine use, unspecified, uncomplicated" },
  { code: "F1491", description: "Cocaine use, unspecified, in remission" },
  {
    code: "F14920",
    description: "Cocaine use, unspecified with intoxication, uncomplicated",
  },
  {
    code: "F14921",
    description: "Cocaine use, unspecified with intoxication delirium",
  },
  {
    code: "F14922",
    description: "Cocaine use, unsp w intoxication with perceptual disturbance",
  },
  {
    code: "F14929",
    description: "Cocaine use, unspecified with intoxication, unspecified",
  },
  { code: "F1493", description: "Cocaine use, unspecified with withdrawal" },
  {
    code: "F1494",
    description: "Cocaine use, unspecified with cocaine-induced mood disorder",
  },
  {
    code: "F14950",
    description: "Cocaine use, unsp w cocaine-induc psych disorder w delusions",
  },
  {
    code: "F14951",
    description: "Cocaine use, unsp w cocaine-induc psych disorder w hallucin",
  },
  {
    code: "F14959",
    description: "Cocaine use, unsp w cocaine-induced psychotic disorder, unsp",
  },
  {
    code: "F14980",
    description: "Cocaine use, unsp with cocaine-induced anxiety disorder",
  },
  {
    code: "F14981",
    description: "Cocaine use, unsp with cocaine-induced sexual dysfunction",
  },
  {
    code: "F14982",
    description: "Cocaine use, unspecified with cocaine-induced sleep disorder",
  },
  {
    code: "F14988",
    description: "Cocaine use, unspecified with other cocaine-induced disorder",
  },
  {
    code: "F1499",
    description: "Cocaine use, unsp with unspecified cocaine-induced disorder",
  },
  { code: "F1510", description: "Other stimulant abuse, uncomplicated" },
  { code: "F1511", description: "Other stimulant abuse, in remission" },
  {
    code: "F15120",
    description: "Other stimulant abuse with intoxication, uncomplicated",
  },
  {
    code: "F15121",
    description: "Other stimulant abuse with intoxication delirium",
  },
  {
    code: "F15122",
    description: "Oth stimulant abuse w intoxication w perceptual disturbance",
  },
  {
    code: "F15129",
    description: "Other stimulant abuse with intoxication, unspecified",
  },
  { code: "F1513", description: "Other stimulant abuse with withdrawal" },
  {
    code: "F1514",
    description: "Other stimulant abuse with stimulant-induced mood disorder",
  },
  {
    code: "F15150",
    description: "Oth stimulant abuse w stim-induce psych disorder w delusions",
  },
  {
    code: "F15151",
    description: "Oth stimulant abuse w stim-induce psych disorder w hallucin",
  },
  {
    code: "F15159",
    description: "Oth stimulant abuse w stim-induce psychotic disorder, unsp",
  },
  {
    code: "F15180",
    description: "Oth stimulant abuse with stimulant-induced anxiety disorder",
  },
  {
    code: "F15181",
    description: "Oth stimulant abuse w stimulant-induced sexual dysfunction",
  },
  {
    code: "F15182",
    description: "Other stimulant abuse with stimulant-induced sleep disorder",
  },
  {
    code: "F15188",
    description: "Other stimulant abuse with other stimulant-induced disorder",
  },
  {
    code: "F1519",
    description: "Other stimulant abuse with unsp stimulant-induced disorder",
  },
  { code: "F1520", description: "Other stimulant dependence, uncomplicated" },
  { code: "F1521", description: "Other stimulant dependence, in remission" },
  {
    code: "F15220",
    description: "Other stimulant dependence with intoxication, uncomplicated",
  },
  {
    code: "F15221",
    description: "Other stimulant dependence with intoxication delirium",
  },
  {
    code: "F15222",
    description: "Oth stimulant dependence w intox w perceptual disturbance",
  },
  {
    code: "F15229",
    description: "Other stimulant dependence with intoxication, unspecified",
  },
  { code: "F1523", description: "Other stimulant dependence with withdrawal" },
  {
    code: "F1524",
    description: "Oth stimulant dependence w stimulant-induced mood disorder",
  },
  {
    code: "F15250",
    description: "Oth stim depend w stim-induce psych disorder w delusions",
  },
  {
    code: "F15251",
    description: "Oth stimulant depend w stim-induce psych disorder w hallucin",
  },
  {
    code: "F15259",
    description: "Oth stimulant depend w stim-induce psychotic disorder, unsp",
  },
  {
    code: "F15280",
    description: "Oth stimulant dependence w stim-induce anxiety disorder",
  },
  {
    code: "F15281",
    description: "Oth stimulant dependence w stim-induce sexual dysfunction",
  },
  {
    code: "F15282",
    description: "Oth stimulant dependence w stimulant-induced sleep disorder",
  },
  {
    code: "F15288",
    description: "Oth stimulant dependence with oth stimulant-induced disorder",
  },
  {
    code: "F1529",
    description: "Oth stimulant dependence w unsp stimulant-induced disorder",
  },
  {
    code: "F1590",
    description: "Other stimulant use, unspecified, uncomplicated",
  },
  {
    code: "F1591",
    description: "Other stimulant use, unspecified, in remission",
  },
  {
    code: "F15920",
    description: "Other stimulant use, unsp with intoxication, uncomplicated",
  },
  {
    code: "F15921",
    description: "Other stimulant use, unspecified with intoxication delirium",
  },
  {
    code: "F15922",
    description: "Oth stimulant use, unsp w intox w perceptual disturbance",
  },
  {
    code: "F15929",
    description: "Other stimulant use, unsp with intoxication, unspecified",
  },
  {
    code: "F1593",
    description: "Other stimulant use, unspecified with withdrawal",
  },
  {
    code: "F1594",
    description: "Oth stimulant use, unsp with stimulant-induced mood disorder",
  },
  {
    code: "F15950",
    description: "Oth stim use, unsp w stim-induce psych disorder w delusions",
  },
  {
    code: "F15951",
    description: "Oth stim use, unsp w stim-induce psych disorder w hallucin",
  },
  {
    code: "F15959",
    description: "Oth stimulant use, unsp w stim-induce psych disorder, unsp",
  },
  {
    code: "F15980",
    description: "Oth stimulant use, unsp w stimulant-induced anxiety disorder",
  },
  {
    code: "F15981",
    description: "Oth stimulant use, unsp w stim-induce sexual dysfunction",
  },
  {
    code: "F15982",
    description: "Oth stimulant use, unsp w stimulant-induced sleep disorder",
  },
  {
    code: "F15988",
    description: "Oth stimulant use, unsp with oth stimulant-induced disorder",
  },
  {
    code: "F1599",
    description: "Oth stimulant use, unsp with unsp stimulant-induced disorder",
  },
  { code: "F1610", description: "Hallucinogen abuse, uncomplicated" },
  { code: "F1611", description: "Hallucinogen abuse, in remission" },
  {
    code: "F16120",
    description: "Hallucinogen abuse with intoxication, uncomplicated",
  },
  {
    code: "F16121",
    description: "Hallucinogen abuse with intoxication with delirium",
  },
  {
    code: "F16122",
    description: "Hallucinogen abuse w intoxication w perceptual disturbance",
  },
  {
    code: "F16129",
    description: "Hallucinogen abuse with intoxication, unspecified",
  },
  {
    code: "F1614",
    description: "Hallucinogen abuse with hallucinogen-induced mood disorder",
  },
  {
    code: "F16150",
    description: "Hallucinogen abuse w psychotic disorder w delusions",
  },
  {
    code: "F16151",
    description: "Hallucinogen abuse w psychotic disorder w hallucinations",
  },
  {
    code: "F16159",
    description: "Hallucinogen abuse w psychotic disorder, unsp",
  },
  {
    code: "F16180",
    description: "Hallucinogen abuse w hallucinogen-induced anxiety disorder",
  },
  {
    code: "F16183",
    description: "Hallucign abuse w hallucign persisting perception disorder",
  },
  {
    code: "F16188",
    description: "Hallucinogen abuse with other hallucinogen-induced disorder",
  },
  {
    code: "F1619",
    description: "Hallucinogen abuse with unsp hallucinogen-induced disorder",
  },
  { code: "F1620", description: "Hallucinogen dependence, uncomplicated" },
  { code: "F1621", description: "Hallucinogen dependence, in remission" },
  {
    code: "F16220",
    description: "Hallucinogen dependence with intoxication, uncomplicated",
  },
  {
    code: "F16221",
    description: "Hallucinogen dependence with intoxication with delirium",
  },
  {
    code: "F16229",
    description: "Hallucinogen dependence with intoxication, unspecified",
  },
  {
    code: "F1624",
    description: "Hallucinogen dependence w hallucinogen-induced mood disorder",
  },
  {
    code: "F16250",
    description: "Hallucinogen dependence w psychotic disorder w delusions",
  },
  {
    code: "F16251",
    description: "Hallucinogen dependence w psychotic disorder w hallucin",
  },
  {
    code: "F16259",
    description: "Hallucinogen dependence w psychotic disorder, unsp",
  },
  { code: "F16280", description: "Hallucinogen dependence w anxiety disorder" },
  {
    code: "F16283",
    description: "Hallucign depend w hallucign persisting perception disorder",
  },
  {
    code: "F16288",
    description: "Hallucinogen dependence w oth hallucinogen-induced disorder",
  },
  {
    code: "F1629",
    description: "Hallucinogen dependence w unsp hallucinogen-induced disorder",
  },
  {
    code: "F1690",
    description: "Hallucinogen use, unspecified, uncomplicated",
  },
  { code: "F1691", description: "Hallucinogen use, unspecified, in remission" },
  {
    code: "F16920",
    description: "Hallucinogen use, unsp with intoxication, uncomplicated",
  },
  {
    code: "F16921",
    description: "Hallucinogen use, unsp with intoxication with delirium",
  },
  {
    code: "F16929",
    description: "Hallucinogen use, unspecified with intoxication, unspecified",
  },
  {
    code: "F1694",
    description: "Hallucinogen use, unsp w hallucinogen-induced mood disorder",
  },
  {
    code: "F16950",
    description: "Hallucinogen use, unsp w psychotic disorder w delusions",
  },
  {
    code: "F16951",
    description: "Hallucinogen use, unsp w psychotic disorder w hallucinations",
  },
  {
    code: "F16959",
    description: "Hallucinogen use, unsp w psychotic disorder, unsp",
  },
  { code: "F16980", description: "Hallucinogen use, unsp w anxiety disorder" },
  {
    code: "F16983",
    description: "Hallucign use, unsp w hallucign persist perception disorder",
  },
  {
    code: "F16988",
    description: "Hallucinogen use, unsp w oth hallucinogen-induced disorder",
  },
  {
    code: "F1699",
    description: "Hallucinogen use, unsp w unsp hallucinogen-induced disorder",
  },
  {
    code: "F17200",
    description: "Nicotine dependence, unspecified, uncomplicated",
  },
  {
    code: "F17201",
    description: "Nicotine dependence, unspecified, in remission",
  },
  {
    code: "F17203",
    description: "Nicotine dependence unspecified, with withdrawal",
  },
  {
    code: "F17208",
    description: "Nicotine dependence, unsp, w oth nicotine-induced disorders",
  },
  {
    code: "F17209",
    description: "Nicotine dependence, unsp, w unsp nicotine-induced disorders",
  },
  {
    code: "F17210",
    description: "Nicotine dependence, cigarettes, uncomplicated",
  },
  {
    code: "F17211",
    description: "Nicotine dependence, cigarettes, in remission",
  },
  {
    code: "F17213",
    description: "Nicotine dependence, cigarettes, with withdrawal",
  },
  {
    code: "F17218",
    description: "Nicotine dependence, cigarettes, w oth disorders",
  },
  {
    code: "F17219",
    description: "Nicotine dependence, cigarettes, w unsp disorders",
  },
  {
    code: "F17220",
    description: "Nicotine dependence, chewing tobacco, uncomplicated",
  },
  {
    code: "F17221",
    description: "Nicotine dependence, chewing tobacco, in remission",
  },
  {
    code: "F17223",
    description: "Nicotine dependence, chewing tobacco, with withdrawal",
  },
  {
    code: "F17228",
    description: "Nicotine dependence, chewing tobacco, w oth disorders",
  },
  {
    code: "F17229",
    description: "Nicotine dependence, chewing tobacco, w unsp disorders",
  },
  {
    code: "F17290",
    description: "Nicotine dependence, other tobacco product, uncomplicated",
  },
  {
    code: "F17291",
    description: "Nicotine dependence, other tobacco product, in remission",
  },
  {
    code: "F17293",
    description: "Nicotine dependence, other tobacco product, with withdrawal",
  },
  {
    code: "F17298",
    description: "Nicotine dependence, oth tobacco product, w oth disorders",
  },
  {
    code: "F17299",
    description: "Nicotine dependence, oth tobacco product, w unsp disorders",
  },
  { code: "F1810", description: "Inhalant abuse, uncomplicated" },
  { code: "F1811", description: "Inhalant abuse, in remission" },
  {
    code: "F18120",
    description: "Inhalant abuse with intoxication, uncomplicated",
  },
  { code: "F18121", description: "Inhalant abuse with intoxication delirium" },
  {
    code: "F18129",
    description: "Inhalant abuse with intoxication, unspecified",
  },
  {
    code: "F1814",
    description: "Inhalant abuse with inhalant-induced mood disorder",
  },
  {
    code: "F18150",
    description: "Inhalant abuse w inhalnt-induce psych disorder w delusions",
  },
  {
    code: "F18151",
    description: "Inhalant abuse w inhalnt-induce psych disorder w hallucin",
  },
  {
    code: "F18159",
    description: "Inhalant abuse w inhalant-induced psychotic disorder, unsp",
  },
  {
    code: "F1817",
    description: "Inhalant abuse with inhalant-induced dementia",
  },
  {
    code: "F18180",
    description: "Inhalant abuse with inhalant-induced anxiety disorder",
  },
  {
    code: "F18188",
    description: "Inhalant abuse with other inhalant-induced disorder",
  },
  {
    code: "F1819",
    description: "Inhalant abuse with unspecified inhalant-induced disorder",
  },
  { code: "F1820", description: "Inhalant dependence, uncomplicated" },
  { code: "F1821", description: "Inhalant dependence, in remission" },
  {
    code: "F18220",
    description: "Inhalant dependence with intoxication, uncomplicated",
  },
  {
    code: "F18221",
    description: "Inhalant dependence with intoxication delirium",
  },
  {
    code: "F18229",
    description: "Inhalant dependence with intoxication, unspecified",
  },
  {
    code: "F1824",
    description: "Inhalant dependence with inhalant-induced mood disorder",
  },
  {
    code: "F18250",
    description: "Inhalant depend w inhalnt-induce psych disorder w delusions",
  },
  {
    code: "F18251",
    description: "Inhalant depend w inhalnt-induce psych disorder w hallucin",
  },
  {
    code: "F18259",
    description: "Inhalant depend w inhalnt-induce psychotic disorder, unsp",
  },
  {
    code: "F1827",
    description: "Inhalant dependence with inhalant-induced dementia",
  },
  {
    code: "F18280",
    description: "Inhalant dependence with inhalant-induced anxiety disorder",
  },
  {
    code: "F18288",
    description: "Inhalant dependence with other inhalant-induced disorder",
  },
  {
    code: "F1829",
    description: "Inhalant dependence with unsp inhalant-induced disorder",
  },
  { code: "F1890", description: "Inhalant use, unspecified, uncomplicated" },
  { code: "F1891", description: "Inhalant use, unspecified, in remission" },
  {
    code: "F18920",
    description: "Inhalant use, unspecified with intoxication, uncomplicated",
  },
  {
    code: "F18921",
    description: "Inhalant use, unspecified with intoxication with delirium",
  },
  {
    code: "F18929",
    description: "Inhalant use, unspecified with intoxication, unspecified",
  },
  {
    code: "F1894",
    description: "Inhalant use, unsp with inhalant-induced mood disorder",
  },
  {
    code: "F18950",
    description: "Inhalant use, unsp w inhalnt-induce psych disord w delusions",
  },
  {
    code: "F18951",
    description: "Inhalant use, unsp w inhalnt-induce psych disord w hallucin",
  },
  {
    code: "F18959",
    description: "Inhalant use, unsp w inhalnt-induce psychotic disorder, unsp",
  },
  {
    code: "F1897",
    description: "Inhalant use, unsp with inhalant-induced persisting dementia",
  },
  {
    code: "F18980",
    description: "Inhalant use, unsp with inhalant-induced anxiety disorder",
  },
  {
    code: "F18988",
    description: "Inhalant use, unsp with other inhalant-induced disorder",
  },
  {
    code: "F1899",
    description: "Inhalant use, unsp with unsp inhalant-induced disorder",
  },
  {
    code: "F1910",
    description: "Other psychoactive substance abuse, uncomplicated",
  },
  {
    code: "F1911",
    description: "Other psychoactive substance abuse, in remission",
  },
  {
    code: "F19120",
    description: "Oth psychoactive substance abuse w intoxication, uncomp",
  },
  {
    code: "F19121",
    description: "Oth psychoactive substance abuse with intoxication delirium",
  },
  {
    code: "F19122",
    description: "Oth psychoactv substance abuse w intox w perceptual disturb",
  },
  {
    code: "F19129",
    description: "Other psychoactive substance abuse with intoxication, unsp",
  },
  {
    code: "F19130",
    description: "Other psychoactive substance abuse with withdrawal, uncomp",
  },
  {
    code: "F19131",
    description: "Other psychoactive substance abuse with withdrawal delirium",
  },
  {
    code: "F19132",
    description: "Other psychoactv sub abuse with w/drawal w perceptl disturb",
  },
  {
    code: "F19139",
    description: "Other psychoactv substance abuse with withdrawal, unsp",
  },
  {
    code: "F1914",
    description: "Oth psychoactive substance abuse w mood disorder",
  },
  {
    code: "F19150",
    description: "Oth psychoactv substance abuse w psych disorder w delusions",
  },
  {
    code: "F19151",
    description: "Oth psychoactv substance abuse w psych disorder w hallucin",
  },
  {
    code: "F19159",
    description: "Oth psychoactive substance abuse w psychotic disorder, unsp",
  },
  {
    code: "F1916",
    description: "Oth psychoactv substance abuse w persist amnestic disorder",
  },
  {
    code: "F1917",
    description: "Oth psychoactive substance abuse w persisting dementia",
  },
  {
    code: "F19180",
    description: "Oth psychoactive substance abuse w anxiety disorder",
  },
  {
    code: "F19181",
    description: "Oth psychoactive substance abuse w sexual dysfunction",
  },
  {
    code: "F19182",
    description: "Oth psychoactive substance abuse w sleep disorder",
  },
  {
    code: "F19188",
    description: "Oth psychoactive substance abuse w oth disorder",
  },
  {
    code: "F1919",
    description: "Oth psychoactive substance abuse w unsp disorder",
  },
  {
    code: "F1920",
    description: "Other psychoactive substance dependence, uncomplicated",
  },
  {
    code: "F1921",
    description: "Other psychoactive substance dependence, in remission",
  },
  {
    code: "F19220",
    description: "Oth psychoactive substance dependence w intoxication, uncomp",
  },
  {
    code: "F19221",
    description: "Oth psychoactive substance dependence w intox delirium",
  },
  {
    code: "F19222",
    description: "Oth psychoactv substance depend w intox w perceptual disturb",
  },
  {
    code: "F19229",
    description: "Oth psychoactive substance dependence w intoxication, unsp",
  },
  {
    code: "F19230",
    description: "Oth psychoactive substance dependence w withdrawal, uncomp",
  },
  {
    code: "F19231",
    description: "Oth psychoactive substance dependence w withdrawal delirium",
  },
  {
    code: "F19232",
    description: "Oth psychoactv sub depend w w/drawal w perceptl disturb",
  },
  {
    code: "F19239",
    description: "Oth psychoactive substance dependence with withdrawal, unsp",
  },
  {
    code: "F1924",
    description: "Oth psychoactive substance dependence w mood disorder",
  },
  {
    code: "F19250",
    description: "Oth psychoactv substance depend w psych disorder w delusions",
  },
  {
    code: "F19251",
    description: "Oth psychoactv substance depend w psych disorder w hallucin",
  },
  {
    code: "F19259",
    description: "Oth psychoactv substance depend w psychotic disorder, unsp",
  },
  {
    code: "F1926",
    description: "Oth psychoactv substance depend w persist amnestic disorder",
  },
  {
    code: "F1927",
    description: "Oth psychoactive substance dependence w persisting dementia",
  },
  {
    code: "F19280",
    description: "Oth psychoactive substance dependence w anxiety disorder",
  },
  {
    code: "F19281",
    description: "Oth psychoactive substance dependence w sexual dysfunction",
  },
  {
    code: "F19282",
    description: "Oth psychoactive substance dependence w sleep disorder",
  },
  {
    code: "F19288",
    description: "Oth psychoactive substance dependence w oth disorder",
  },
  {
    code: "F1929",
    description: "Oth psychoactive substance dependence w unsp disorder",
  },
  {
    code: "F1990",
    description: "Other psychoactive substance use, unspecified, uncomplicated",
  },
  {
    code: "F1991",
    description: "Other psychoactive substance use, unspecified, in remission",
  },
  {
    code: "F19920",
    description: "Oth psychoactive substance use, unsp w intoxication, uncomp",
  },
  {
    code: "F19921",
    description: "Oth psychoactive substance use, unsp w intox w delirium",
  },
  {
    code: "F19922",
    description: "Oth psychoactv sub use, unsp w intox w perceptl disturb",
  },
  {
    code: "F19929",
    description: "Oth psychoactive substance use, unsp with intoxication, unsp",
  },
  {
    code: "F19930",
    description: "Oth psychoactive substance use, unsp w withdrawal, uncomp",
  },
  {
    code: "F19931",
    description: "Oth psychoactive substance use, unsp w withdrawal delirium",
  },
  {
    code: "F19932",
    description: "Oth psychoactv sub use, unsp w w/drawal w perceptl disturb",
  },
  {
    code: "F19939",
    description: "Other psychoactive substance use, unsp with withdrawal, unsp",
  },
  {
    code: "F1994",
    description: "Oth psychoactive substance use, unsp w mood disorder",
  },
  {
    code: "F19950",
    description: "Oth psychoactv sub use, unsp w psych disorder w delusions",
  },
  {
    code: "F19951",
    description: "Oth psychoactv sub use, unsp w psych disorder w hallucin",
  },
  {
    code: "F19959",
    description: "Oth psychoactv substance use, unsp w psych disorder, unsp",
  },
  {
    code: "F1996",
    description: "Oth psychoactv sub use, unsp w persist amnestic disorder",
  },
  {
    code: "F1997",
    description: "Oth psychoactive substance use, unsp w persisting dementia",
  },
  {
    code: "F19980",
    description: "Oth psychoactive substance use, unsp w anxiety disorder",
  },
  {
    code: "F19981",
    description: "Oth psychoactive substance use, unsp w sexual dysfunction",
  },
  {
    code: "F19982",
    description: "Oth psychoactive substance use, unsp w sleep disorder",
  },
  {
    code: "F19988",
    description: "Oth psychoactive substance use, unsp w oth disorder",
  },
  {
    code: "F1999",
    description: "Oth psychoactive substance use, unsp w unsp disorder",
  },
  { code: "F200", description: "Paranoid schizophrenia" },
  { code: "F201", description: "Disorganized schizophrenia" },
  { code: "F202", description: "Catatonic schizophrenia" },
  { code: "F203", description: "Undifferentiated schizophrenia" },
  { code: "F205", description: "Residual schizophrenia" },
  { code: "F2081", description: "Schizophreniform disorder" },
  { code: "F2089", description: "Other schizophrenia" },
  { code: "F209", description: "Schizophrenia, unspecified" },
  { code: "F21", description: "Schizotypal disorder" },
  { code: "F22", description: "Delusional disorders" },
  { code: "F23", description: "Brief psychotic disorder" },
  { code: "F24", description: "Shared psychotic disorder" },
  { code: "F250", description: "Schizoaffective disorder, bipolar type" },
  { code: "F251", description: "Schizoaffective disorder, depressive type" },
  { code: "F258", description: "Other schizoaffective disorders" },
  { code: "F259", description: "Schizoaffective disorder, unspecified" },
  {
    code: "F28",
    description: "Oth psych disorder not due to a sub or known physiol cond",
  },
  {
    code: "F29",
    description: "Unsp psychosis not due to a substance or known physiol cond",
  },
  {
    code: "F3010",
    description: "Manic episode without psychotic symptoms, unspecified",
  },
  {
    code: "F3011",
    description: "Manic episode without psychotic symptoms, mild",
  },
  {
    code: "F3012",
    description: "Manic episode without psychotic symptoms, moderate",
  },
  {
    code: "F3013",
    description: "Manic episode, severe, without psychotic symptoms",
  },
  {
    code: "F302",
    description: "Manic episode, severe with psychotic symptoms",
  },
  { code: "F303", description: "Manic episode in partial remission" },
  { code: "F304", description: "Manic episode in full remission" },
  { code: "F308", description: "Other manic episodes" },
  { code: "F309", description: "Manic episode, unspecified" },
  { code: "F310", description: "Bipolar disorder, current episode hypomanic" },
  {
    code: "F3110",
    description: "Bipolar disord, crnt episode manic w/o psych features, unsp",
  },
  {
    code: "F3111",
    description: "Bipolar disord, crnt episode manic w/o psych features, mild",
  },
  {
    code: "F3112",
    description: "Bipolar disord, crnt episode manic w/o psych features, mod",
  },
  {
    code: "F3113",
    description: "Bipolar disord, crnt epsd manic w/o psych features, severe",
  },
  {
    code: "F312",
    description: "Bipolar disord, crnt episode manic severe w psych features",
  },
  {
    code: "F3130",
    description: "Bipolar disord, crnt epsd depress, mild or mod severt, unsp",
  },
  {
    code: "F3131",
    description: "Bipolar disorder, current episode depressed, mild",
  },
  {
    code: "F3132",
    description: "Bipolar disorder, current episode depressed, moderate",
  },
  {
    code: "F314",
    description: "Bipolar disord, crnt epsd depress, sev, w/o psych features",
  },
  {
    code: "F315",
    description: "Bipolar disord, crnt epsd depress, severe, w psych features",
  },
  {
    code: "F3160",
    description: "Bipolar disorder, current episode mixed, unspecified",
  },
  {
    code: "F3161",
    description: "Bipolar disorder, current episode mixed, mild",
  },
  {
    code: "F3162",
    description: "Bipolar disorder, current episode mixed, moderate",
  },
  {
    code: "F3163",
    description: "Bipolar disord, crnt epsd mixed, severe, w/o psych features",
  },
  {
    code: "F3164",
    description: "Bipolar disord, crnt episode mixed, severe, w psych features",
  },
  {
    code: "F3170",
    description: "Bipolar disord, currently in remis, most recent episode unsp",
  },
  {
    code: "F3171",
    description: "Bipolar disord, in partial remis, most recent epsd hypomanic",
  },
  {
    code: "F3172",
    description: "Bipolar disord, in full remis, most recent episode hypomanic",
  },
  {
    code: "F3173",
    description: "Bipolar disord, in partial remis, most recent episode manic",
  },
  {
    code: "F3174",
    description: "Bipolar disorder, in full remis, most recent episode manic",
  },
  {
    code: "F3175",
    description: "Bipolar disord, in partial remis, most recent epsd depress",
  },
  {
    code: "F3176",
    description: "Bipolar disorder, in full remis, most recent episode depress",
  },
  {
    code: "F3177",
    description: "Bipolar disord, in partial remis, most recent episode mixed",
  },
  {
    code: "F3178",
    description: "Bipolar disorder, in full remis, most recent episode mixed",
  },
  { code: "F3181", description: "Bipolar II disorder" },
  { code: "F3189", description: "Other bipolar disorder" },
  { code: "F319", description: "Bipolar disorder, unspecified" },
  {
    code: "F320",
    description: "Major depressive disorder, single episode, mild",
  },
  {
    code: "F321",
    description: "Major depressive disorder, single episode, moderate",
  },
  {
    code: "F322",
    description: "Major depressv disord, single epsd, sev w/o psych features",
  },
  {
    code: "F323",
    description: "Major depressv disord, single epsd, severe w psych features",
  },
  {
    code: "F324",
    description: "Major depressv disorder, single episode, in partial remis",
  },
  {
    code: "F325",
    description: "Major depressive disorder, single episode, in full remission",
  },
  { code: "F328", description: "Other depressive episodes" },
  { code: "F3281", description: "Premenstrual dysphoric disorder" },
  { code: "F3289", description: "Other specified depressive episodes" },
  {
    code: "F329",
    description: "Major depressive disorder, single episode, unspecified",
  },
  { code: "F32A", description: "Depression, unspecified" },
  { code: "F330", description: "Major depressive disorder, recurrent, mild" },
  {
    code: "F331",
    description: "Major depressive disorder, recurrent, moderate",
  },
  {
    code: "F332",
    description: "Major depressv disorder, recurrent severe w/o psych features",
  },
  {
    code: "F333",
    description: "Major depressv disorder, recurrent, severe w psych symptoms",
  },
  {
    code: "F3340",
    description: "Major depressive disorder, recurrent, in remission, unsp",
  },
  {
    code: "F3341",
    description: "Major depressive disorder, recurrent, in partial remission",
  },
  {
    code: "F3342",
    description: "Major depressive disorder, recurrent, in full remission",
  },
  { code: "F338", description: "Other recurrent depressive disorders" },
  {
    code: "F339",
    description: "Major depressive disorder, recurrent, unspecified",
  },
  { code: "F340", description: "Cyclothymic disorder" },
  { code: "F341", description: "Dysthymic disorder" },
  { code: "F348", description: "Other persistent mood [affective] disorders" },
  { code: "F3481", description: "Disruptive mood dysregulation disorder" },
  { code: "F3489", description: "Other specified persistent mood disorders" },
  {
    code: "F349",
    description: "Persistent mood [affective] disorder, unspecified",
  },
  { code: "F39", description: "Unspecified mood [affective] disorder" },
  { code: "F4000", description: "Agoraphobia, unspecified" },
  { code: "F4001", description: "Agoraphobia with panic disorder" },
  { code: "F4002", description: "Agoraphobia without panic disorder" },
  { code: "F4010", description: "Social phobia, unspecified" },
  { code: "F4011", description: "Social phobia, generalized" },
  { code: "F40210", description: "Arachnophobia" },
  { code: "F40218", description: "Other animal type phobia" },
  { code: "F40220", description: "Fear of thunderstorms" },
  { code: "F40228", description: "Other natural environment type phobia" },
  { code: "F40230", description: "Fear of blood" },
  { code: "F40231", description: "Fear of injections and transfusions" },
  { code: "F40232", description: "Fear of other medical care" },
  { code: "F40233", description: "Fear of injury" },
  { code: "F40240", description: "Claustrophobia" },
  { code: "F40241", description: "Acrophobia" },
  { code: "F40242", description: "Fear of bridges" },
  { code: "F40243", description: "Fear of flying" },
  { code: "F40248", description: "Other situational type phobia" },
  { code: "F40290", description: "Androphobia" },
  { code: "F40291", description: "Gynephobia" },
  { code: "F40298", description: "Other specified phobia" },
  { code: "F408", description: "Other phobic anxiety disorders" },
  { code: "F409", description: "Phobic anxiety disorder, unspecified" },
  { code: "F410", description: "Panic disorder without agoraphobia" },
  { code: "F411", description: "Generalized anxiety disorder" },
  { code: "F413", description: "Other mixed anxiety disorders" },
  { code: "F418", description: "Other specified anxiety disorders" },
  { code: "F419", description: "Anxiety disorder, unspecified" },
  { code: "F42", description: "Obsessive-compulsive disorder" },
  { code: "F422", description: "Mixed obsessional thoughts and acts" },
  { code: "F423", description: "Hoarding disorder" },
  { code: "F424", description: "Excoriation (skin-picking) disorder" },
  { code: "F428", description: "Other obsessive-compulsive disorder" },
  { code: "F429", description: "Obsessive-compulsive disorder, unspecified" },
  { code: "F430", description: "Acute stress reaction" },
  { code: "F4310", description: "Post-traumatic stress disorder, unspecified" },
  { code: "F4311", description: "Post-traumatic stress disorder, acute" },
  { code: "F4312", description: "Post-traumatic stress disorder, chronic" },
  { code: "F4320", description: "Adjustment disorder, unspecified" },
  { code: "F4321", description: "Adjustment disorder with depressed mood" },
  { code: "F4322", description: "Adjustment disorder with anxiety" },
  {
    code: "F4323",
    description: "Adjustment disorder with mixed anxiety and depressed mood",
  },
  {
    code: "F4324",
    description: "Adjustment disorder with disturbance of conduct",
  },
  {
    code: "F4325",
    description: "Adjustment disorder w mixed disturb of emotions and conduct",
  },
  { code: "F4329", description: "Adjustment disorder with other symptoms" },
  { code: "F438", description: "Other reactions to severe stress" },
  { code: "F4381", description: "Prolonged grief disorder" },
  { code: "F4389", description: "Other reactions to severe stress" },
  { code: "F439", description: "Reaction to severe stress, unspecified" },
  { code: "F440", description: "Dissociative amnesia" },
  { code: "F441", description: "Dissociative fugue" },
  { code: "F442", description: "Dissociative stupor" },
  {
    code: "F444",
    description: "Conversion disorder with motor symptom or deficit",
  },
  {
    code: "F445",
    description: "Conversion disorder with seizures or convulsions",
  },
  {
    code: "F446",
    description: "Conversion disorder with sensory symptom or deficit",
  },
  {
    code: "F447",
    description: "Conversion disorder with mixed symptom presentation",
  },
  { code: "F4481", description: "Dissociative identity disorder" },
  { code: "F4489", description: "Other dissociative and conversion disorders" },
  {
    code: "F449",
    description: "Dissociative and conversion disorder, unspecified",
  },
  { code: "F450", description: "Somatization disorder" },
  { code: "F451", description: "Undifferentiated somatoform disorder" },
  { code: "F4520", description: "Hypochondriacal disorder, unspecified" },
  { code: "F4521", description: "Hypochondriasis" },
  { code: "F4522", description: "Body dysmorphic disorder" },
  { code: "F4529", description: "Other hypochondriacal disorders" },
  {
    code: "F4541",
    description: "Pain disorder exclusively related to psychological factors",
  },
  {
    code: "F4542",
    description: "Pain disorder with related psychological factors",
  },
  { code: "F458", description: "Other somatoform disorders" },
  { code: "F459", description: "Somatoform disorder, unspecified" },
  { code: "F481", description: "Depersonalization-derealization syndrome" },
  { code: "F482", description: "Pseudobulbar affect" },
  {
    code: "F488",
    description: "Other specified nonpsychotic mental disorders",
  },
  { code: "F489", description: "Nonpsychotic mental disorder, unspecified" },
  { code: "F5000", description: "Anorexia nervosa, unspecified" },
  { code: "F5001", description: "Anorexia nervosa, restricting type" },
  { code: "F50010", description: "Anorexia nervosa, restricting type, mild" },
  {
    code: "F50011",
    description: "Anorexia nervosa, restricting type, moderate",
  },
  { code: "F50012", description: "Anorexia nervosa, restricting type, severe" },
  {
    code: "F50013",
    description: "Anorexia nervosa, restricting type, extreme",
  },
  {
    code: "F50014",
    description: "Anorexia nervosa, restricting type, in remission",
  },
  {
    code: "F50019",
    description: "Anorexia nervosa, restricting type, unspecified",
  },
  { code: "F5002", description: "Anorexia nervosa, binge eating/purging type" },
  {
    code: "F50020",
    description: "Anorexia nervosa, binge eating/purging type, mild",
  },
  {
    code: "F50021",
    description: "Anorexia nervosa, binge eating/purging type, moderate",
  },
  {
    code: "F50022",
    description: "Anorexia nervosa, binge eating/purging type, severe",
  },
  {
    code: "F50023",
    description: "Anorexia nervosa, binge eating/purging type, extreme",
  },
  {
    code: "F50024",
    description: "Anorexia nervosa, binge eating/purging type, in remission",
  },
  {
    code: "F50029",
    description: "Anorexia nervosa, binge eating/purging type, unspecified",
  },
  { code: "F502", description: "Bulimia nervosa" },
  { code: "F5020", description: "Bulimia nervosa, unspecified" },
  { code: "F5021", description: "Bulimia nervosa, mild" },
  { code: "F5022", description: "Bulimia nervosa, moderate" },
  { code: "F5023", description: "Bulimia nervosa, severe" },
  { code: "F5024", description: "Bulimia nervosa, extreme" },
  { code: "F5025", description: "Bulimia nervosa, in remission" },
  { code: "F508", description: "Other eating disorders" },
  { code: "F5081", description: "Binge eating disorder" },
  { code: "F50810", description: "Binge eating disorder, mild" },
  { code: "F50811", description: "Binge eating disorder, moderate" },
  { code: "F50812", description: "Binge eating disorder, severe" },
  { code: "F50813", description: "Binge eating disorder, extreme" },
  { code: "F50814", description: "Binge eating disorder, in remission" },
  { code: "F50819", description: "Binge eating disorder, unspecified" },
  { code: "F5082", description: "Avoidant/restrictive food intake disorder" },
  { code: "F5083", description: "Pica in adults" },
  { code: "F5084", description: "Rumination disorder in adults" },
  { code: "F5089", description: "Other specified eating disorder" },
  { code: "F509", description: "Eating disorder, unspecified" },
  { code: "F5101", description: "Primary insomnia" },
  { code: "F5102", description: "Adjustment insomnia" },
  { code: "F5103", description: "Paradoxical insomnia" },
  { code: "F5104", description: "Psychophysiologic insomnia" },
  { code: "F5105", description: "Insomnia due to other mental disorder" },
  {
    code: "F5109",
    description: "Oth insomnia not due to a substance or known physiol cond",
  },
  { code: "F5111", description: "Primary hypersomnia" },
  { code: "F5112", description: "Insufficient sleep syndrome" },
  { code: "F5113", description: "Hypersomnia due to other mental disorder" },
  {
    code: "F5119",
    description: "Oth hypersomnia not due to a substance or known physiol cond",
  },
  { code: "F513", description: "Sleepwalking [somnambulism]" },
  { code: "F514", description: "Sleep terrors [night terrors]" },
  { code: "F515", description: "Nightmare disorder" },
  {
    code: "F518",
    description: "Oth sleep disord not due to a sub or known physiol cond",
  },
  {
    code: "F519",
    description: "Sleep disorder not due to a sub or known physiol cond, unsp",
  },
  { code: "F520", description: "Hypoactive sexual desire disorder" },
  { code: "F521", description: "Sexual aversion disorder" },
  { code: "F5221", description: "Male erectile disorder" },
  { code: "F5222", description: "Female sexual arousal disorder" },
  { code: "F5231", description: "Female orgasmic disorder" },
  { code: "F5232", description: "Male orgasmic disorder" },
  { code: "F524", description: "Premature ejaculation" },
  {
    code: "F525",
    description: "Vaginismus not due to a substance or known physiol condition",
  },
  {
    code: "F526",
    description: "Dyspareunia not due to a substance or known physiol cond",
  },
  {
    code: "F528",
    description: "Oth sexual dysfnct not due to a sub or known physiol cond",
  },
  {
    code: "F529",
    description: "Unsp sexual dysfnct not due to a sub or known physiol cond",
  },
  { code: "F53", description: "Puerperal psychosis" },
  { code: "F530", description: "Postpartum depression" },
  { code: "F531", description: "Puerperal psychosis" },
  {
    code: "F54",
    description: "Psych & behavrl factors assoc w disord or dis classd elswhr",
  },
  { code: "F550", description: "Abuse of antacids" },
  { code: "F551", description: "Abuse of herbal or folk remedies" },
  { code: "F552", description: "Abuse of laxatives" },
  { code: "F553", description: "Abuse of steroids or hormones" },
  { code: "F554", description: "Abuse of vitamins" },
  { code: "F558", description: "Abuse of other non-psychoactive substances" },
  {
    code: "F59",
    description: "Unsp behavrl synd assoc w physiol disturb and physcl factors",
  },
  { code: "F600", description: "Paranoid personality disorder" },
  { code: "F601", description: "Schizoid personality disorder" },
  { code: "F602", description: "Antisocial personality disorder" },
  { code: "F603", description: "Borderline personality disorder" },
  { code: "F604", description: "Histrionic personality disorder" },
  { code: "F605", description: "Obsessive-compulsive personality disorder" },
  { code: "F606", description: "Avoidant personality disorder" },
  { code: "F607", description: "Dependent personality disorder" },
  { code: "F6081", description: "Narcissistic personality disorder" },
  { code: "F6089", description: "Other specific personality disorders" },
  { code: "F609", description: "Personality disorder, unspecified" },
  { code: "F630", description: "Pathological gambling" },
  { code: "F631", description: "Pyromania" },
  { code: "F632", description: "Kleptomania" },
  { code: "F633", description: "Trichotillomania" },
  { code: "F6381", description: "Intermittent explosive disorder" },
  { code: "F6389", description: "Other impulse disorders" },
  { code: "F639", description: "Impulse disorder, unspecified" },
  { code: "F640", description: "Transsexualism" },
  { code: "F641", description: "Dual role transvestism" },
  { code: "F642", description: "Gender identity disorder of childhood" },
  { code: "F648", description: "Other gender identity disorders" },
  { code: "F649", description: "Gender identity disorder, unspecified" },
  { code: "F650", description: "Fetishism" },
  { code: "F651", description: "Transvestic fetishism" },
  { code: "F652", description: "Exhibitionism" },
  { code: "F653", description: "Voyeurism" },
  { code: "F654", description: "Pedophilia" },
  { code: "F6550", description: "Sadomasochism, unspecified" },
  { code: "F6551", description: "Sexual masochism" },
  { code: "F6552", description: "Sexual sadism" },
  { code: "F6581", description: "Frotteurism" },
  { code: "F6589", description: "Other paraphilias" },
  { code: "F659", description: "Paraphilia, unspecified" },
  { code: "F66", description: "Other sexual disorders" },
  {
    code: "F6810",
    description: "Factitious disorder imposed on self, unspecified",
  },
  {
    code: "F6811",
    description: "Factitious disorder w predom psych signs and symptoms",
  },
  {
    code: "F6812",
    description: "Factit disord impsd on self, with predom physcl signs/symp",
  },
  {
    code: "F6813",
    description:
      "Factit disord impsd on self, w comb psych & physcl signs/symp",
  },
  {
    code: "F688",
    description: "Other specified disorders of adult personality and behavior",
  },
  { code: "F68A", description: "Factitious disorder imposed on another" },
  {
    code: "F69",
    description: "Unspecified disorder of adult personality and behavior",
  },
  { code: "F70", description: "Mild intellectual disabilities" },
  { code: "F71", description: "Moderate intellectual disabilities" },
  { code: "F72", description: "Severe intellectual disabilities" },
  { code: "F73", description: "Profound intellectual disabilities" },
  { code: "F78", description: "Other intellectual disabilities" },
  { code: "F78A1", description: "SYNGAP1-related intellectual disability" },
  {
    code: "F78A9",
    description: "Other genetic related intellectual disability",
  },
  { code: "F79", description: "Unspecified intellectual disabilities" },
  { code: "F800", description: "Phonological disorder" },
  { code: "F801", description: "Expressive language disorder" },
  { code: "F802", description: "Mixed receptive-expressive language disorder" },
  {
    code: "F804",
    description: "Speech and language development delay due to hearing loss",
  },
  { code: "F8081", description: "Childhood onset fluency disorder" },
  { code: "F8082", description: "Social pragmatic communication disorder" },
  {
    code: "F8089",
    description: "Other developmental disorders of speech and language",
  },
  {
    code: "F809",
    description: "Developmental disorder of speech and language, unspecified",
  },
  { code: "F810", description: "Specific reading disorder" },
  { code: "F812", description: "Mathematics disorder" },
  { code: "F8181", description: "Disorder of written expression" },
  {
    code: "F8189",
    description: "Other developmental disorders of scholastic skills",
  },
  {
    code: "F819",
    description: "Developmental disorder of scholastic skills, unspecified",
  },
  {
    code: "F82",
    description: "Specific developmental disorder of motor function",
  },
  { code: "F840", description: "Autistic disorder" },
  { code: "F842", description: "Rett's syndrome" },
  { code: "F843", description: "Other childhood disintegrative disorder" },
  { code: "F845", description: "Asperger's syndrome" },
  { code: "F848", description: "Other pervasive developmental disorders" },
  {
    code: "F849",
    description: "Pervasive developmental disorder, unspecified",
  },
  { code: "F88", description: "Other disorders of psychological development" },
  {
    code: "F89",
    description: "Unspecified disorder of psychological development",
  },
  {
    code: "F900",
    description: "Attn-defct hyperactivity disorder, predom inattentive type",
  },
  {
    code: "F901",
    description: "Attn-defct hyperactivity disorder, predom hyperactive type",
  },
  {
    code: "F902",
    description: "Attention-deficit hyperactivity disorder, combined type",
  },
  {
    code: "F908",
    description: "Attention-deficit hyperactivity disorder, other type",
  },
  {
    code: "F909",
    description: "Attention-deficit hyperactivity disorder, unspecified type",
  },
  { code: "F910", description: "Conduct disorder confined to family context" },
  { code: "F911", description: "Conduct disorder, childhood-onset type" },
  { code: "F912", description: "Conduct disorder, adolescent-onset type" },
  { code: "F913", description: "Oppositional defiant disorder" },
  { code: "F918", description: "Other conduct disorders" },
  { code: "F919", description: "Conduct disorder, unspecified" },
  { code: "F930", description: "Separation anxiety disorder of childhood" },
  { code: "F938", description: "Other childhood emotional disorders" },
  { code: "F939", description: "Childhood emotional disorder, unspecified" },
  { code: "F940", description: "Selective mutism" },
  { code: "F941", description: "Reactive attachment disorder of childhood" },
  {
    code: "F942",
    description: "Disinhibited attachment disorder of childhood",
  },
  {
    code: "F948",
    description: "Other childhood disorders of social functioning",
  },
  {
    code: "F949",
    description: "Childhood disorder of social functioning, unspecified",
  },
  { code: "F950", description: "Transient tic disorder" },
  { code: "F951", description: "Chronic motor or vocal tic disorder" },
  { code: "F952", description: "Tourette's disorder" },
  { code: "F958", description: "Other tic disorders" },
  { code: "F959", description: "Tic disorder, unspecified" },
  {
    code: "F980",
    description: "Enuresis not due to a substance or known physiol condition",
  },
  {
    code: "F981",
    description: "Encopresis not due to a substance or known physiol condition",
  },
  {
    code: "F9821",
    description: "Rumination disorder of infancy and childhood",
  },
  {
    code: "F9829",
    description: "Other feeding disorders of infancy and early childhood",
  },
  { code: "F983", description: "Pica of infancy and childhood" },
  { code: "F984", description: "Stereotyped movement disorders" },
  { code: "F985", description: "Adult onset fluency disorder" },
  {
    code: "F988",
    description: "Oth behav/emotn disord w onset usly occur in chldhd and adol",
  },
  {
    code: "F989",
    description: "Unsp behav/emotn disord w onst usly occur in chldhd and adol",
  },
  { code: "F99", description: "Mental disorder, not otherwise specified" },
];

const zCodes = [
  {
    code: "Z00",
    description:
      "General examination and investigation of persons without complaint or reported diagnosis",
  },
  {
    code: "Z01",
    description:
      "Other special examinations and investigations of persons without complaint",
  },
  { code: "Z02", description: "Encounter for administrative examinations" },
  {
    code: "Z03",
    description:
      "Medical observation and evaluation for suspected diseases and conditions",
  },
  {
    code: "Z04",
    description: "Encounter for examination and observation for other reasons",
  },
  {
    code: "Z05",
    description:
      "Encounter for observation and evaluation of newborn for suspected diseases and conditions",
  },
  {
    code: "Z08",
    description: "Follow-up examination after treatment for malignant neoplasm",
  },
  {
    code: "Z09",
    description:
      "Follow-up examination after treatment for conditions other than malignant neoplasm",
  },
  {
    code: "Z11",
    description:
      "Encounter for screening for infectious and parasitic diseases",
  },
  {
    code: "Z12",
    description: "Encounter for screening for malignant neoplasms",
  },
  {
    code: "Z13",
    description: "Encounter for screening for other diseases and disorders",
  },
  { code: "Z14", description: "Genetic carrier" },
  { code: "Z15", description: "Genetic susceptibility to disease" },
  { code: "Z16", description: "Resistance to antimicrobial drugs" },
  { code: "Z17", description: "Estrogen receptor status" },
  { code: "Z18", description: "Retained foreign body fragments" },
  { code: "Z19", description: "Hormone sensitivity malignancy status" },
  {
    code: "Z20",
    description: "Contact with and suspected exposure to communicable diseases",
  },
  { code: "Z21", description: "Asymptomatic HIV infection status" },
  { code: "Z22", description: "Carrier of infectious disease" },
  { code: "Z23", description: "Encounter for immunization" },
  { code: "Z28", description: "Immunization not carried out" },
  { code: "Z29", description: "Encounter for other prophylactic measures" },
  { code: "Z30", description: "Encounter for contraceptive management" },
  { code: "Z31", description: "Encounter for procreative management" },
  {
    code: "Z32",
    description: "Encounter for pregnancy test and childbirth instruction",
  },
  { code: "Z33", description: "Pregnant state, incidental" },
  { code: "Z34", description: "Encounter for supervision of normal pregnancy" },
  {
    code: "Z35",
    description: "Encounter for supervision of high-risk pregnancy",
  },
  { code: "Z36", description: "Encounter for antenatal screening" },
  { code: "Z37", description: "Outcome of delivery" },
  {
    code: "Z38",
    description:
      "Liveborn infants according to place of birth and type of delivery",
  },
  {
    code: "Z39",
    description: "Encounter for maternal postpartum care and examination",
  },
  { code: "Z40", description: "Encounter for prophylactic surgery" },
  {
    code: "Z41",
    description:
      "Encounter for procedures for purposes other than remedying health state",
  },
  {
    code: "Z42",
    description:
      "Encounter for plastic and reconstructive surgery following medical procedure or healed injury",
  },
  {
    code: "Z43",
    description: "Encounter for attention to artificial openings",
  },
  {
    code: "Z44",
    description:
      "Encounter for fitting and adjustment of external prosthetic device",
  },
  {
    code: "Z45",
    description: "Encounter for adjustment and management of implanted device",
  },
  {
    code: "Z46",
    description: "Encounter for fitting and adjustment of other devices",
  },
  { code: "Z47", description: "Orthopedic aftercare" },
  { code: "Z48", description: "Encounter for other postprocedural aftercare" },
  { code: "Z49", description: "Encounter for care involving renal dialysis" },
  {
    code: "Z50",
    description: "Care involving use of rehabilitation procedures",
  },
  {
    code: "Z51",
    description: "Encounter for other aftercare and medical care",
  },
  { code: "Z52", description: "Donors of organs and tissues" },
  {
    code: "Z53",
    description:
      "Persons encountering health services for specific procedures, not carried out",
  },
  { code: "Z55", description: "Problems related to education and literacy" },
  {
    code: "Z56",
    description: "Problems related to employment and unemployment",
  },
  { code: "Z57", description: "Occupational exposure to risk factors" },
  { code: "Z58", description: "Problems related to physical environment" },
  {
    code: "Z59",
    description: "Problems related to housing and economic circumstances",
  },
  { code: "Z60", description: "Problems related to social environment" },
  { code: "Z62", description: "Problems related to upbringing" },
  {
    code: "Z63",
    description: "Other problems related to primary support group",
  },
  {
    code: "Z64",
    description: "Problems related to certain psychosocial circumstances",
  },
  {
    code: "Z65",
    description: "Problems related to other psychosocial circumstances",
  },
  { code: "Z66", description: "Do not resuscitate" },
  { code: "Z67", description: "Blood type" },
  { code: "Z68", description: "Body mass index (BMI)" },
  {
    code: "Z69",
    description:
      "Encounter for mental health services for victim and perpetrator of abuse",
  },
  {
    code: "Z70",
    description:
      "Counseling related to sexual attitude, behavior and orientation",
  },
  {
    code: "Z71",
    description:
      "Persons encountering health services for other counseling and medical advice",
  },
  { code: "Z72", description: "Problems related to lifestyle" },
  {
    code: "Z73",
    description: "Problems related to life-management difficulty",
  },
  { code: "Z74", description: "Problems related to care provider dependency" },
  {
    code: "Z75",
    description: "Problems related to medical facilities and other health care",
  },
  {
    code: "Z76",
    description: "Persons encountering health services in other circumstances",
  },
  {
    code: "Z77",
    description:
      "Other contact with and suspected exposures hazardous to health",
  },
  { code: "Z78", description: "Other specified health status" },
  { code: "Z79", description: "Long term (current) drug therapy" },
  { code: "Z80", description: "Family history of malignant neoplasm" },
  {
    code: "Z81",
    description: "Family history of mental and behavioral disorders",
  },
  {
    code: "Z82",
    description: "Family history of certain disabilities and chronic diseases",
  },
  { code: "Z83", description: "Family history of other specific disorders" },
  { code: "Z84", description: "Family history of other conditions" },
  { code: "Z85", description: "Personal history of malignant neoplasm" },
  { code: "Z86", description: "Personal history of certain other diseases" },
  {
    code: "Z87",
    description: "Personal history of other diseases and conditions",
  },
  {
    code: "Z88",
    description:
      "Allergy status to drugs, medicaments and biological substances",
  },
  { code: "Z89", description: "Acquired absence of limb" },
  { code: "Z90", description: "Acquired absence of organs" },
  {
    code: "Z91",
    description: "Personal risk factors, not elsewhere classified",
  },
  { code: "Z92", description: "Personal history of medical treatment" },
  { code: "Z93", description: "Artificial opening status" },
  { code: "Z94", description: "Transplanted organ and tissue status" },
  {
    code: "Z95",
    description: "Presence of cardiac and vascular implants and grafts",
  },
  { code: "Z96", description: "Presence of other functional implants" },
  { code: "Z97", description: "Presence of other devices" },
  { code: "Z98", description: "Other postprocedural states" },
  { code: "Z99", description: "Dependence on enabling machines and devices" },
];

const rCodes = [
  { code: "R00", description: "Abnormalities of heart beat" },
  { code: "R01", description: "Cardiac murmurs and other cardiac sounds" },
  { code: "R02", description: "Gangrene, not elsewhere classified" },
  {
    code: "R03",
    description: "Abnormal blood-pressure reading, without diagnosis",
  },
  { code: "R04", description: "Hemorrhage from respiratory passages" },
  { code: "R05", description: "Cough" },
  { code: "R06", description: "Abnormalities of breathing" },
  { code: "R07", description: "Pain in throat and chest" },
  {
    code: "R09",
    description:
      "Other symptoms and signs involving the circulatory and respiratory systems",
  },

  { code: "R10", description: "Abdominal and pelvic pain" },
  { code: "R11", description: "Nausea and vomiting" },
  { code: "R12", description: "Heartburn" },
  { code: "R13", description: "Dysphagia" },
  { code: "R14", description: "Flatulence and related conditions" },
  { code: "R15", description: "Fecal incontinence" },
  {
    code: "R16",
    description: "Hepatomegaly and splenomegaly, not elsewhere classified",
  },
  { code: "R17", description: "Unspecified jaundice" },
  { code: "R18", description: "Ascites" },
  {
    code: "R19",
    description:
      "Other symptoms and signs involving the digestive system and abdomen",
  },

  { code: "R20", description: "Disturbances of skin sensation" },
  { code: "R21", description: "Rash and other nonspecific skin eruption" },
  {
    code: "R22",
    description:
      "Localized swelling, mass and lump of skin and subcutaneous tissue",
  },
  { code: "R23", description: "Other skin changes" },

  { code: "R25", description: "Abnormal involuntary movements" },
  { code: "R26", description: "Abnormalities of gait and mobility" },
  { code: "R27", description: "Other lack of coordination" },
  {
    code: "R29",
    description:
      "Other symptoms and signs involving the nervous and musculoskeletal systems",
  },

  { code: "R30", description: "Pain associated with micturition" },
  { code: "R31", description: "Hematuria" },
  { code: "R32", description: "Unspecified urinary incontinence" },
  { code: "R33", description: "Retention of urine" },
  { code: "R34", description: "Anuria and oliguria" },
  { code: "R35", description: "Polyuria" },
  { code: "R36", description: "Urethral discharge" },
  {
    code: "R39",
    description: "Other symptoms and signs involving the genitourinary system",
  },

  { code: "R40", description: "Somnolence, stupor and coma" },
  {
    code: "R41",
    description:
      "Other symptoms and signs involving cognitive functions and awareness",
  },
  { code: "R42", description: "Dizziness and giddiness" },
  { code: "R43", description: "Disturbances of smell and taste" },
  {
    code: "R44",
    description:
      "Other symptoms and signs involving general sensations and perceptions",
  },
  { code: "R45", description: "Symptoms and signs involving emotional state" },
  {
    code: "R46",
    description: "Symptoms and signs involving appearance and behavior",
  },
  { code: "R47", description: "Speech disturbances, not elsewhere classified" },
  {
    code: "R48",
    description:
      "Dyslexia and other symbolic dysfunctions, not elsewhere classified",
  },
  { code: "R49", description: "Voice and resonance disorders" },

  { code: "R50", description: "Fever of other and unknown origin" },
  { code: "R51", description: "Headache" },
  { code: "R52", description: "Pain, unspecified" },
  { code: "R53", description: "Malaise and fatigue" },
  { code: "R54", description: "Age-related physical debility" },
  { code: "R55", description: "Syncope and collapse" },
  { code: "R56", description: "Convulsions, not elsewhere classified" },
  { code: "R57", description: "Shock, not elsewhere classified" },
  { code: "R58", description: "Hemorrhage, not elsewhere classified" },
  { code: "R59", description: "Enlarged lymph nodes" },

  { code: "R60", description: "Edema, not elsewhere classified" },
  { code: "R61", description: "Hyperhidrosis" },
  {
    code: "R62",
    description:
      "Lack of expected normal physiological development in childhood",
  },
  {
    code: "R63",
    description: "Symptoms and signs concerning food and fluid intake",
  },
  { code: "R64", description: "Cachexia" },
  {
    code: "R65",
    description:
      "Systemic inflammatory response syndrome (SIRS) of non-infectious origin",
  },
  { code: "R68", description: "Other general symptoms and signs" },
  { code: "R69", description: "Illness, unspecified" },

  {
    code: "R70",
    description:
      "Elevated erythrocyte sedimentation rate and abnormal plasma viscosity",
  },
  { code: "R71", description: "Abnormality of red blood cells" },
  { code: "R73", description: "Elevated blood glucose level" },
  { code: "R74", description: "Abnormal serum enzyme levels" },
  {
    code: "R75",
    description:
      "Inconclusive laboratory evidence of human immunodeficiency virus [HIV]",
  },
  {
    code: "R76",
    description: "Other abnormal immunological findings in serum",
  },
  { code: "R77", description: "Other abnormalities of plasma proteins" },
  {
    code: "R78",
    description:
      "Findings of drugs and other substances, not normally found in blood",
  },
  { code: "R79", description: "Other abnormal findings of blood chemistry" },

  { code: "R80", description: "Proteinuria" },
  { code: "R81", description: "Glycosuria" },
  { code: "R82", description: "Other abnormal findings in urine" },
  { code: "R83", description: "Abnormal findings in cerebrospinal fluid" },
  {
    code: "R84",
    description:
      "Abnormal findings in specimens from respiratory organs and thorax",
  },
  {
    code: "R85",
    description:
      "Abnormal findings in specimens from digestive organs and abdominal cavity",
  },
  {
    code: "R86",
    description: "Abnormal findings in specimens from male genital organs",
  },
  {
    code: "R87",
    description: "Abnormal findings in specimens from female genital organs",
  },
  {
    code: "R88",
    description:
      "Abnormal findings in specimens from other organs, systems and tissues",
  },
  {
    code: "R89",
    description:
      "Abnormal findings in specimens from other organs, systems and tissues",
  },

  {
    code: "R90",
    description:
      "Abnormal findings on diagnostic imaging of central nervous system",
  },
  {
    code: "R91",
    description: "Abnormal findings on diagnostic imaging of lung",
  },
  {
    code: "R92",
    description:
      "Abnormal and inconclusive findings on diagnostic imaging of breast",
  },
  {
    code: "R93",
    description:
      "Abnormal findings on diagnostic imaging of other body structures",
  },
  { code: "R94", description: "Abnormal results of function studies" },

  { code: "R97", description: "Abnormal tumor markers" },
  { code: "R99", description: "Ill-defined and unknown cause of mortality" },
];

const gCodes = [
  {
    code: "G00",
    description: "Bacterial meningitis, not elsewhere classified",
  },
  {
    code: "G01",
    description: "Meningitis in bacterial diseases classified elsewhere",
  },
  {
    code: "G02",
    description:
      "Meningitis in other infectious and parasitic diseases classified elsewhere",
  },
  {
    code: "G03",
    description: "Meningitis due to other and unspecified causes",
  },
  { code: "G04", description: "Encephalitis, myelitis and encephalomyelitis" },
  {
    code: "G05",
    description:
      "Encephalitis, myelitis and encephalomyelitis in diseases classified elsewhere",
  },
  {
    code: "G06",
    description: "Intracranial and intraspinal abscess and granuloma",
  },
  {
    code: "G07",
    description:
      "Intracranial and intraspinal abscess and granuloma in diseases classified elsewhere",
  },
  {
    code: "G08",
    description: "Intracranial and intraspinal phlebitis and thrombophlebitis",
  },
  {
    code: "G09",
    description: "Sequelae of inflammatory diseases of central nervous system",
  },

  { code: "G10", description: "Huntington disease" },
  { code: "G11", description: "Hereditary ataxia" },
  { code: "G12", description: "Spinal muscular atrophy and related syndromes" },
  {
    code: "G13",
    description:
      "Systemic atrophies primarily affecting central nervous system in diseases classified elsewhere",
  },
  { code: "G14", description: "Postpolio syndrome" },

  { code: "G20", description: "Parkinson disease" },
  { code: "G21", description: "Secondary parkinsonism" },
  { code: "G23", description: "Other degenerative diseases of basal ganglia" },
  { code: "G24", description: "Dystonia" },
  { code: "G25", description: "Other extrapyramidal and movement disorders" },
  {
    code: "G26",
    description:
      "Extrapyramidal and movement disorders in diseases classified elsewhere",
  },

  { code: "G30", description: "Alzheimer disease" },
  {
    code: "G31",
    description:
      "Other degenerative diseases of nervous system, not elsewhere classified",
  },
  {
    code: "G32",
    description:
      "Other degenerative disorders of nervous system in diseases classified elsewhere",
  },

  { code: "G35", description: "Multiple sclerosis" },
  { code: "G36", description: "Other acute disseminated demyelination" },
  {
    code: "G37",
    description: "Other demyelinating diseases of central nervous system",
  },

  { code: "G40", description: "Epilepsy and recurrent seizures" },
  { code: "G41", description: "Status epilepticus" },

  { code: "G43", description: "Migraine" },
  { code: "G44", description: "Other headache syndromes" },
  {
    code: "G45",
    description: "Transient cerebral ischemic attacks and related syndromes",
  },
  {
    code: "G46",
    description: "Vascular syndromes of brain in cerebrovascular diseases",
  },
  { code: "G47", description: "Sleep disorders" },

  { code: "G50", description: "Disorders of trigeminal nerve" },
  { code: "G51", description: "Facial nerve disorders" },
  { code: "G52", description: "Disorders of other cranial nerves" },

  { code: "G54", description: "Nerve root and plexus disorders" },
  {
    code: "G55",
    description:
      "Nerve root and plexus compressions in diseases classified elsewhere",
  },
  { code: "G56", description: "Mononeuropathies of upper limb" },
  { code: "G57", description: "Mononeuropathies of lower limb" },
  { code: "G58", description: "Other mononeuropathies" },
  {
    code: "G59",
    description: "Mononeuropathy in diseases classified elsewhere",
  },

  { code: "G60", description: "Hereditary and idiopathic neuropathy" },
  { code: "G61", description: "Inflammatory polyneuropathy" },
  { code: "G62", description: "Other polyneuropathies" },
  {
    code: "G63",
    description: "Polyneuropathy in diseases classified elsewhere",
  },
  { code: "G64", description: "Other disorders of peripheral nervous system" },

  {
    code: "G70",
    description: "Myasthenia gravis and other myoneural disorders",
  },
  { code: "G71", description: "Primary disorders of muscles" },
  { code: "G72", description: "Other and unspecified myopathies" },
  {
    code: "G73",
    description:
      "Disorders of myoneural junction and muscle in diseases classified elsewhere",
  },

  { code: "G80", description: "Cerebral palsy" },
  { code: "G81", description: "Hemiplegia and hemiparesis" },
  { code: "G82", description: "Paraplegia and tetraplegia" },
  { code: "G83", description: "Other paralytic syndromes" },

  { code: "G89", description: "Pain, not elsewhere classified" },

  { code: "G90", description: "Disorders of autonomic nervous system" },
  { code: "G91", description: "Hydrocephalus" },
  { code: "G92", description: "Toxic encephalopathy" },
  { code: "G93", description: "Other disorders of brain" },
  {
    code: "G94",
    description: "Other disorders of brain in diseases classified elsewhere",
  },
  { code: "G95", description: "Other diseases of spinal cord" },
  { code: "G96", description: "Other disorders of central nervous system" },
  {
    code: "G97",
    description:
      "Intraoperative and postprocedural complications and disorders of nervous system, not elsewhere classified",
  },
  {
    code: "G98",
    description: "Other disorders of nervous system, not elsewhere classified",
  },
  {
    code: "G99",
    description:
      "Other disorders of nervous system in diseases classified elsewhere",
  },
];

const insurances = [
  { name: "Athens", faxNumber: "8886736364" },
  { name: "State Fund", faxNumber: "7076466592" },
  { name: "Sedgwick", faxNumber: "8779227236" },
  { name: "Galagher Basett", faxNumber: "6157785135" },
  { name: "Allied Managed Care", faxNumber: "9163623043" },
  { name: "Zenith", faxNumber: "8182273057" },
  { name: "Rosico", faxNumber: "6782588587" },
  { name: "Liberty Mutual and Helmsman", faxNumber: "8552874028" },
  { name: "ICW", faxNumber: "8552874028" },
  { name: "LWP", faxNumber: "4087250395" },
  { name: "ESIS", faxNumber: "8882413208" },
  { name: "Zurich", faxNumber: "8667431634" },
  { name: "CareWorks", faxNumber: "8005803123" },
  { name: "FedEx", faxNumber: "8779227236" },
  { name: "Contra Costa County Schools Ins. Group", faxNumber: "9256921137" },
  { name: "Broadspire", faxNumber: "7707776447" },
  { name: "Sentry", faxNumber: "8009994642" },
  { name: "Corvel", faxNumber: "8669104423" },
  { name: "Nationwide Agribusiness Insurance", faxNumber: "8008421482" },
  { name: "Travelers", faxNumber: "8663816713" },
  { name: "Tristar", faxNumber: "5625060355" },

  {
    name: "California insurance guarantee associateion (CIGA)",
    faxNumber: "8182911863",
  },
  { name: "Hartford", faxNumber: "8775361529" },
  { name: "Republic Indemnity", faxNumber: "8187897286" },
  { name: "Intermed/Intercare", faxNumber: "9167815595" },
  { name: "Amtrust", faxNumber: "6782588395" },
  { name: "University of California", faxNumber: "8779227236" },
];

async function generateRFA(patient, type, meds) {
  const rfaDoc = await PDFDocument.load(await readFile("./RFA.pdf"));

  const form = rfaDoc.getForm();

  const fieldsNames = form.getFields().map((field) => field.getName());

  form.getTextField("Name Last First Middle").setText(patient.name);

  form.getTextField("Date of Birth MMDDYYYY").setText(patient.dob);

  form.getTextField("Claim Number").setText(patient.memberId);

  form.getTextField("Date of Injury MMDDYYYY").setText(patient.doi);

  form.getTextField("Employer").setText(patient.employer || "");

  form

    .getTextField("Fax Number_2")

    .setText(
      patient.insFax ||
        insurances.find((i) => i.name === patient.insurance)?.faxNumber ||
        "",
    );

  //reset diagnosis fields

  form.getTextField("Diagnosis RequiredRow1").setText("");

  form.getTextField("ICDCode RequiredRow1").setText("");

  form.getTextField("Diagnosis RequiredRow2").setText("");

  form.getTextField("ICDCode RequiredRow2").setText("");

  form.getTextField("Diagnosis RequiredRow3").setText("");

  form.getTextField("ICDCode RequiredRow3").setText("");

  form.getTextField("Diagnosis RequiredRow4").setText("");

  form.getTextField("ICDCode RequiredRow4").setText("");

  form.getTextField("Diagnosis RequiredRow5").setText("");

  form.getTextField("ICDCode RequiredRow5").setText("");

  patient.icdCodes.forEach((code, index) => {
    if (index >= 5) return;

    if (code.startsWith("F") || code.startsWith("f")) {
      const description =
        fCodes.find((c) => c.code === code)?.description || "";

      form

        .getTextField(`Diagnosis RequiredRow${index + 1}`)

        .setText(description);

      form.getTextField(`ICDCode RequiredRow${index + 1}`).setText(code);
    } else if (code.startsWith("Z") || code.startsWith("z")) {
      const description =
        zCodes.find((c) => code.startsWith(c.code))?.description || "";

      form

        .getTextField(`Diagnosis RequiredRow${index + 1}`)

        .setText(description);

      form.getTextField(`ICDCode RequiredRow${index + 1}`).setText(code);
    } else if (code.startsWith("R") || code.startsWith("r")) {
      const description =
        rCodes.find((c) => code.startsWith(c.code))?.description || "";

      form

        .getTextField(`Diagnosis RequiredRow${index + 1}`)

        .setText(description);

      form.getTextField(`ICDCode RequiredRow${index + 1}`).setText(code);
    } else if (code.startsWith("G") || code.startsWith("g")) {
      const description =
        gCodes.find((c) => code.startsWith(c.code))?.description || "";

      form

        .getTextField(`Diagnosis RequiredRow${index + 1}`)

        .setText(description);

      form.getTextField(`ICDCode RequiredRow${index + 1}`).setText(code);
    }
  });

  if (type === "Medication Management and Psychotherapy") {
    form

      .getTextField("ServiceGood Requested RequiredRow1")

      .setText("Medication Management");

    form.getTextField("CPTHCPCS Code If knownRow1").setText("99214, 90833");

    form

      .getTextField("Other Information Frequency Duration Quantity etcRow1")

      .setText("6 Sessions");

    form

      .getTextField("ServiceGood Requested RequiredRow2")

      .setText("Psychotherapy");

    form.getTextField("CPTHCPCS Code If knownRow2").setText("90834");

    form

      .getTextField("Other Information Frequency Duration Quantity etcRow2")

      .setText("6 Sessions");
  } else {
    //reset service fields

    if (type === "Medications") {
      meds.forEach((med, index) => {
        if (index >= 5) return;

        form

          .getTextField(`ServiceGood Requested RequiredRow${index + 1}`)

          .setText(med.nameAndDosage);

        form.getTextField(`CPTHCPCS Code If knownRow${index + 1}`).setText("");

        form

          .getTextField(
            `Other Information Frequency Duration Quantity etcRow${index + 1}`,
          )

          .setText(
            `${med.frequency} days, ${med.quantity}#, ${med.refills} refills`,
          );
      });
    } else {
      form.getTextField("ServiceGood Requested RequiredRow1").setText(type);

      form

        .getTextField("Other Information Frequency Duration Quantity etcRow1")

        .setText("6 Sessions");

      if (type === "Medication Management") {
        form.getTextField("CPTHCPCS Code If knownRow1").setText("99214, 90833");
      } else if (type === "Psychotherapy") {
        form.getTextField("CPTHCPCS Code If knownRow1").setText("90834");
      }
    }
  }

  form.getTextField("Date").setText(new Date().toISOString().split("T")[0]);

  const pdfBytes = await rfaDoc.save();

  return pdfBytes;
}

// Import Patient model

const Patient = require("./models/Patient");

const { log } = require("node:console");

//connect to mongodb

mongoose
  .connect("mongodb://127.0.0.1:27017/RFAs")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

//API endpoints

app.post("/addPatient", async (req, res) => {
  try {
    const OllamaUrl = "http://localhost:11434/api/generate";
    const body = req.body;


  

    const response = await axios.post(OllamaUrl, {
      model: "qwen2.5:7b-instruct-q4_K_M",
      prompt: `extract codes from this text: "${body.icdCodes}" The codes should be separated by commas without white spaces"`,


  stream: false
    });

    log(response.data);

    const icdCodes = response.data.response.trim().split(",").map((code) => code.replace(".","").trim());

    const patient = new Patient({
      name: body.name,
      dob: body.dob,
      memberId: body.memberId,
      doi: body.doi,
      employer: body.employer || "",
      meds: body.meds || [],
      insurance: body.insurance,
      insFax: body.insFax || "",
      icdCodes,
    });

    await patient.save();

    res.status(201).json({
      message: "Patient added successfully",
    });
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).json({
      message: "Failed to add patient",
    });
  }
});

app.get("/getPatients", async (req, res) => {
  try {
    const patients = await Patient.find();

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);

    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

app.post("/generateRFA", async (req, res) => {
  try {
    const memberId = req.body.memberId;

    const type = req.body.type;
    const meds = req.body.meds;

    const patient = await Patient.findOne({ memberId: memberId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const pdfBytes = await generateRFA(patient, type, meds);

    res.setHeader("Content-Type", "application/pdf");

    res.send(pdfBytes);
  } catch (error) {
    console.error("Error fetching patient:", error);

    res.status(500).json({ message: "Failed to fetch patient" });
  }
});

app.post("/sendfax", async (req, res) => {
  try {
    const data = {
      faxNumber: `+1${req.body.to}`,

      faxData: [
        {
          fileName: req.body.fileName,

          fileData: req.body.file,
        },
      ],
    };

    let result = await axios.post(
      "https://api.ifaxapp.com/v1/customer/fax-send",
      data,
      {
        headers: {
          accessToken: `D426F645-56E443F5-8B2D-A3DBFF8E005A`,

          "Content-Type": "application/json",
        },
      },
    );

    return res
      .status(200)
      .json({ message: "Fax sent successfully", result: result.data });
  } catch (error) {
    console.error("Error sending fax:", error);

    res.status(500).json({ message: "Failed to send fax" });
  }
});

app.get("/getPatient", async (req, res) => {
  try {
    const patient = await Patient({ memberId: req.query.memberId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);

    res.status(500).json({ message: "Failed to fetch patient" });
  }
});

app.put("/updatePatient", async (req, res) => {
  try {
    const body = req.body;

    const patient = await Patient.findByIdAndUpdate(body.id, body, {
      new: true,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient updated successfully" });
  } catch (error) {
    console.error("Error updating patient:", error);

    res.status(500).json({ message: "Failed to update patient" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});