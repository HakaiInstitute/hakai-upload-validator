const columnSchema = require("../config/columns");
/**
 * Put data into 'levels', starting from array of objects, one line in an excel sheet being one object
 * Uses columns definitions in columns.js
 * @param {Array} arr  An array of objects, one object per row of data with db fields as keys
 * @param {String} dataType From metadata, eg SUVA
 * @returns {Array} A new array with objects put into 'levels'
 */
const json2ObjectLevels = (arr, dataType) =>
  arr.map((row) => {
    const rowOut = {};
    // allheaders being metadata and datasheets headers
    const allHeaders = Object.keys(row);
    allHeaders.forEach((headerName) => {
      const field = columnSchema[dataType][headerName];
      const outputName = columnSchema[dataType]._output;
      if (field) {
        const { level } = field;
        if (level === 1) {
          rowOut[field.output || headerName] = row[headerName];
        } else {
          if (!rowOut[outputName]) {
            rowOut[outputName] = {};
          }
          rowOut[outputName][field.output || headerName] = row[headerName];
        }
      }
    });
    return rowOut;
  });

module.exports = json2ObjectLevels;

// 'Levelled' data looks like
// [
//   {
//     "SUVA": {
//       "a254": "0",
//       "a350": "0",
//       "a250": "0",
//       "a365": "0",
//       "analyzing_lab": "Hakai"
//     },
//     "source": "Freshwater" // <-- Level 1
//   }
// ]
