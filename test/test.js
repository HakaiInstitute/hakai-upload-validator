/* eslint no-unused-vars: "off" */

const XLSX = require("xlsx");

const processWorkBookAndValidate = require("../src/processWorkBookAndValidate");

const prettyConsoleLog = str => console.log(JSON.stringify(str, null, 2));

const fileName = "2017-11-15_141319_HakaiData_nutrients bad.xlsx";

const workbookRaw = XLSX.readFile(`excelFiles/${fileName}`);

const workbookJSON = Object.keys(workbookRaw.Sheets).map(sheetName => ({
  name: sheetName,
  data: XLSX.utils.sheet_to_json(workbookRaw.Sheets[sheetName], {
    header: 1
  })
}));
const { metadataErrorLog, submissions } = processWorkBookAndValidate(
  workbookJSON,
  "someuser@hakai.org",
  fileName,
  false // commit flag
);
if (metadataErrorLog.length) {
  console.error(metadataErrorLog);
} else {
  submissions.forEach(submission => {
    const {
      results,
      form_name,
      process,
      commit,
      user,
      worksheet,
      validationLog,
      debugObj
    } = submission;
    prettyConsoleLog(validationLog);
    // prettyConsoleLog(results.inputs);
    // prettyConsoleLog(validationLog.mlog.filter(v=>v.level==='error'));
  });
}
