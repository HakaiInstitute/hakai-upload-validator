const XLSX = require("xlsx");
const path = require("path");
const processWorkBookAndValidate = require("../src/processWorkBookAndValidate");

const filePath = process.argv.pop();

const prettyConsoleLog = (str) => console.log(JSON.stringify(str, null, 2));
const workbookRaw = XLSX.readFile(filePath);

const workbookJSON = Object.keys(workbookRaw.Sheets).map((sheetName) => ({
  name: sheetName,
  data: XLSX.utils.sheet_to_json(workbookRaw.Sheets[sheetName], {
    header: 1,
  }),
}));

const { metadataErrorLog, submissions } = processWorkBookAndValidate(
  workbookJSON,
  "someuser@hakai.org",
  path.basename(filePath),
  false, // commit flag
);

if (metadataErrorLog.length) {
  prettyConsoleLog(metadataErrorLog);
} else {
  prettyConsoleLog(submissions);
}
