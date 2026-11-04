const moment = require("moment-timezone");
const uuidv4 = require("uuid/v4");
const Joi = require("joi");
const uniqueSets = require("../config/uniqueSets");

const columnSchema = require("../config/columns");
const Memlog = require("./memlog");
const rowCleaner = require("./rowCleaner");
const findDuplicates = require("./findDuplicates");
const json2ObjectLevels = require("./json2ObjectLevels");
const getDBFieldByRelatedText = require("./getDBFieldByRelatedText");
const xmlnsFromMetadata = require("../config/xmlnsFromMetadata");
const joiValidate = require("./joiValidate");
// const { prettyConsoleLog } = require("./common");

const TIMEZONE = "America/Vancouver";

// TODO write more tests

function processWorkBookAndValidate(
  workBook,
  submittingUser,
  filename,
  commit = true
) {
  const metadata = {};
  const joiDefKeys = {};
  let joiDefObj;
  const fieldMappingsMetadata = [];

  // using Set here to not get multiple 'field not mapped' message for same field
  const fieldsNotMapped = new Set();

  // workBook is JSON array of objects with keys 'name' and 'data' for each sheet
  // eg:
  //
  // [
  //   { name: "Hakai Metadata", data: [[], [], []] },
  //   { name: "Hakai Variables", data: [[], [], []] },
  //   { name: "Hakai Data", data: [[], [], []] }
  // ];
  // ]

  // workbook is array of sheet objects
  const metaDataSheets = workBook.filter(sheet =>
    sheet.name.includes("Hakai Metadata")
  );
  const dataSheets = workBook.filter(sheet =>
    sheet.name.includes("Hakai Data")
  );
  const metaMLog = new Memlog();
  // need a metadatasheet to figure out sample type

  if (!metaDataSheets.length) {
    metaMLog.error("No metadata sheet found");
    return { metadataErrorLog: metaMLog.dump() };
  }

  metaDataSheets.forEach(metaDataSheet => {
    // iterate through each row in sheet that has a value at first column
    metaDataSheet.data
      .filter(row => row[0] && row[1] !== undefined)
      .filter(row => row[0] !== "Metadata property")
      .filter(row => typeof row[0] === "string")
      .forEach(row => {
        const [excelField, value] = row;
        const dbField = getDBFieldByRelatedText(
          excelField,
          columnSchema.defaultMetadata
        );

        if (dbField) {
          const defObj = columnSchema.defaultMetadata[dbField];
          // obj.joi holds the joi rules
          if (defObj.joi) {
            // if the excel field lookup yielded a match, use that excel field as the label for error messages
            joiDefKeys[dbField] = defObj.joi.concat(
              Joi.any().label(excelField)
            );
          }

          metadata[dbField] = value;
          fieldMappingsMetadata.push([excelField, dbField]);
        } else {
          fieldsNotMapped.add(excelField);
        }
      });
  });

  let dataType;

  if (metadata.data_type) {
    dataType = metadata.data_type.toUpperCase();
  } else {
    metaMLog.error("Could not determine data type or find it's definition");
  }

  if (dataType && !columnSchema[dataType]) {
    metaMLog.error(`Could not determine definition for data type ${dataType}`);
  }

  // compile joi object:
  if (columnSchema.defaultMetadata._joiobj) {
    joiDefObj = columnSchema.defaultMetadata._joiobj;
  }

  if (!dataSheets.length) {
    metaMLog.error("No data sheets found");
  }
  const metaDataHasErrors = metaMLog.dump().some(r => r.level === "error");

  if (metaDataHasErrors) {
    return { metadataErrorLog: metaMLog.dump() };
  }
  // Process Data Sheets
  // There is one 'submission' object for each datasheet
  const submissions = dataSheets.map(
    dataSheet => {
      const mlog = new Memlog();
      const fieldMappingsDatasheet = [];
      // map field names to excel column index
      const fieldToIndexMap = {};

      const { data } = dataSheet;
      const headerRow = data[0];
      const nonHeaderRows = data.splice(1);

      // add all the keys to the schema. This is needed to test for required columns that are missing
      Object.entries(columnSchema[dataType]).forEach(([key,value])=>{
        if (value.joi) {
          joiDefKeys[key] = value.joi
        }
      })

      headerRow.forEach((fieldRaw, c) => {
        const sampleTypeDefObj = columnSchema[dataType];
        const field = getDBFieldByRelatedText(fieldRaw.trim(), sampleTypeDefObj);

        if (field) {
          const fieldDefinition = sampleTypeDefObj[field];
          if (fieldDefinition.joi) {
            // for existing fields, update there label information, used in error reporting later
            joiDefKeys[field] = fieldDefinition.joi.concat(
              Joi.any().label(fieldRaw)
            );
          }
          fieldMappingsDatasheet.push([fieldRaw, field]);

          fieldToIndexMap[field] = c;
        } else {
          fieldsNotMapped.add(fieldRaw);
        }
      });

      const joiObjForDataType = columnSchema[dataType]._joiobj;

      // they all start with the default metadata joi _object, but if there is one specific to this sample then use that
      if (joiObjForDataType) {
        joiDefObj = joiObjForDataType;
      }

      const dataOneObjectPerRow = nonHeaderRows
        .map(row => rowCleaner(row, fieldToIndexMap))
        // remove empty rows
        .filter(row => Object.keys(row).length);

      // add meta data to each row. Note if a value is both in datasheets and metadata sheets,
      // will take datasheet value
      const metaDataFieldsToAddToRows = {
        source: metadata.source,
        analyzing_lab: metadata.analyzing_lab,
        process: metadata.process
      };

      // combine certain metadata fields with the rows output
      // calling it 'Flat' because the levels haven't been added yet, no child objects
      const dataFlatWithMetadata = dataOneObjectPerRow.map(row => ({
        ...metaDataFieldsToAddToRows,
        ...row
      }));

      // Find duplicates if data has all these headers
      // rowCleaner may have added headers, so this is the best check for current headers
      const duplicates = findDuplicates(uniqueSets, dataFlatWithMetadata);

      if (duplicates.length) {
        // join duplicates array with semi colon so it is easyer to group duplicate fields together.
        // i.e. if duplicate is based on hakai_id and analyzing lab then both columns
        //   will be reported seporated by a comma.
        mlog.error(`Duplicates found: ${duplicates.join('; ')}`);
      }

      const formname = [
        metadata.data_type,
        metadata.souce,
        metadata.analyzing_lab,
        metadata.program,
        metadata.project
      ]
        // filter out empty / null entries in array befor joining
        .filter(val => val)
        .join(":");

      // put data into 'levels'
      const dataWithLevels = json2ObjectLevels(dataFlatWithMetadata, dataType);

      // validate 'flat' (no levels) data using Joi
      const joiLog = joiValidate(dataFlatWithMetadata, joiDefObj, joiDefKeys);

      // array of data indices with errors flagged
      const rowIndicesWithJoiErrors = joiLog.map(log => log.rowIndex);

      // final output of data to DB - filter out rows that are mentioned in joiLog
      const inputs = dataWithLevels.filter(
        (row, i) => !rowIndicesWithJoiErrors.includes(i)
      );

      const validationLog = { joiLog, mlog: mlog.dump() };

      const hasValidationErrors =
        joiLog.length > 0 || mlog.dump().some(log => log.level === "error");

      // Faking submission from device magic?
      const attributes = {
        form_xmlns: xmlnsFromMetadata(metadata),
        submissionIdentifier: uuidv4(),
        dm_submit_time: moment.utc().format(),
        writeTime: moment.tz(TIMEZONE).format(),
        dm_form: formname,
        formVersion: "0.1",
        source_file: filename,
        analyzing_lab: metadata.analyzing_lab,
        program: metadata.program,
        project: metadata.project,
        submission_source: submittingUser,
        dm_submitting_user: "",
        dm_submitting_device: ""
      };

      const results = {
        inputs,
        "@attributes": attributes
      };

      const debugObj = {
        filename,
        user: submittingUser,
        commit,
        // metadata keys, values
        metadata,
        attributes,
        // array of erroneous duplicates
        duplicates,
        joiKeys: Object.keys(joiDefKeys),
        fieldToIndexMap,
        fieldMappings: fieldMappingsMetadata.concat(fieldMappingsDatasheet),
        dataSheets: dataSheets.map(sheet => sheet.name),
        metaDataSheets: metaDataSheets.map(sheet => sheet.name),
        first5Inputs: dataFlatWithMetadata.slice(0, 5),
        first5Results: results.inputs.slice(0, 5),
        // stringify doesn't work with Set, convert to array
        fieldsNotMapped: [...fieldsNotMapped],
        validationLog,
        hasValidationErrors,
        rowIndicesWithJoiErrors
      };

      // Create submission array to later send data to the database
      const submission = {
        results,
        form_name: results["@attributes"].dm_form,
        process: true,
        commit,
        user: submittingUser,
        worksheet: dataSheet.name,
        validationLog,
        debugObj,
        hasValidationErrors
      };

      return submission;
    } // end of Hakai Data worksheets map loop
  );
  return { metadataErrorLog: metaMLog.dump(), submissions };
} // end of function
module.exports = processWorkBookAndValidate;
