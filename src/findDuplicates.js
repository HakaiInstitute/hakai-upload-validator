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

  // first remove the sets that we dont have all headers for
  const uniqueSetsMissingHeadersRemoved = uniqueSets.filter(uniqueSet =>
    arrayIncludesArray(headers, uniqueSet)
  );

  if (!uniqueSetsMissingHeadersRemoved.length) return [];

  // For each for in worksheet, create a string joining the values at the fieldnames given by uniqueSets for comparison
  const uniqueResults = data.map(row =>
    uniqueSetsMissingHeadersRemoved.map(uniqueSet => uniqueSet.map(field => row[field]).join("|"))
  );

  // remove empty lines
  const uniqueResultsNoEmpties = uniqueSetsMissingHeadersRemoved.map((set, i) =>
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

  return deDupArray(dupes).map(dupe=>dupe.replace('||',''));
};
module.exports = findDuplicates;
