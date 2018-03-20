const dateParser = require("./dateParser");
const { getKeyByValue } = require("./common");

/**
 *  Cleans up row data - parses dates and splits site names into watershed ID, site name
 *  @param {Object} row is an array of raw cell values
 *  @param {Object} fieldToIndexMap is an object that links field names to excel column index {date:0,hakai_id:2}
 */
const rowCleaner = (row, fieldToIndexMap) => {
  const dateTimeFields = [
    "date",
    "collected",
    "preserved",
    "analyzed",
    "calibration_date",
    "tow_start_time",
    "tow_end_time",
    "tow_bottom_time",
    "collected_start",
    "collected_end",
    "lab_date",
    "inoculation_time",
    "incubation_start_time",
    "incubation_end_time",
    "filtering_end_time",
    "dna_extraction_datetime",
    "start_range",
    "end_range",
  ];
  // cleanedRow object  has db fields as keys
  const cleanedRow = {};
  row.forEach((cell, c) => {
    const dbField = getKeyByValue(fieldToIndexMap, c);
    // TODO check for required fields / columns based on sample type
    // cell could be 0 but dont bother if it blank
    if (dbField && cell !== undefined && cell !== "") {
      // analyzed is datetime and doesnt need separate date
      if (dateTimeFields.includes(dbField)) {
        // dateParser needs to know a date to fill date/time fields that only have time
        let date;
        if (fieldToIndexMap.date) date = row[fieldToIndexMap.date];

        cleanedRow[dbField] = dateParser(cell, date);
      } else if (dbField === "quality_log") {
        // remove \u0000 (null character) values from quality_log
        cleanedRow.quality_log = cell.replace(/\0/g, "");
      } else if (dbField === "site_id" && cell.includes(" ")) {
        // get watershed from site id if not already set.
        // eg "site_id": "819 WTW25" becomes "Watershed_ID": "819","Site_ID": "WTW25"
        const [watershedID, siteID] = cell.split(" ");
        // set watershed ID this way if either watershed's not a header or it is but there's no data there
        if (
          siteID &&
          (!fieldToIndexMap.watershed ||
            (fieldToIndexMap.watershed && !row[fieldToIndexMap.watershed]))
        ) {
          // split site on space into watershed and site if watershed is not set
          cleanedRow.watershed = watershedID;
          cleanedRow.site_id = siteID;
        }
      } else if (Object.keys(fieldToIndexMap).includes(dbField)) {
        cleanedRow[dbField] = cell;
      }
    }
  });
  return cleanedRow;
};
module.exports = rowCleaner;
