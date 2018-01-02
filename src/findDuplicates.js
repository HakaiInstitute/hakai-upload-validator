const {
  arrayIncludesArray,
  deDupArray,
  arrayFindMultipleIndices
} = require("./common");

/**
 * Finds duplicates in date to be uploaded
 * @param {Array} uniqueSets Array of Array of fieldnames eg  ["analyzing_lab", "source", "event_id"]
 * @param {Object} data
 * @returns {Array}
 */
const findDuplicates = (uniqueSets, data) => {
  if (!data.length) return [];

  const headers = Object.keys(data[0]);

  // first check if we even have these sets of headers in this file
  if (!uniqueSets.some(uniqueSet => arrayIncludesArray(headers, uniqueSet)))
    return [];

  // For each for in worksheet, create a string joining the values at the fieldnames given by uniqueSets for comparison
  const uniqueResults = data.map(row =>
    uniqueSets.map(uniqueSet => uniqueSet.map(field => row[field]).join("|"))
  );

  // remove empty lines
  const uniqueResultsNoEmpties = uniqueSets.map((set, i) =>
    uniqueResults.map(row => row[i]).filter(r => r !== "||")
  );

  const dupes = [];
  uniqueResultsNoEmpties.forEach(joinStringArray => {
    joinStringArray.forEach(joinedRow => {
      const dupIndices = arrayFindMultipleIndices(joinStringArray, joinedRow);
      // will all match at least once
      if (dupIndices.length > 1) {
        dupes.push(joinedRow);
      }
    });
  });
  return deDupArray(dupes);
};
module.exports = findDuplicates;
