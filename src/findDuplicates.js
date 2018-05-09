const { deDupArray, arrayFindMultipleIndices } = require("./common");

/**
 * Finds duplicates in date to be uploaded
 * @param {Array} uniqueSets Array of Array of fieldnames eg  ["analyzing_lab", "source", "event_id"]
 * @param {Object} data
 * @returns {Array}
 */
const findDuplicates = (uniqueSets, data) => {
  if (!data.length) return [];

  // that check for first column being set is because not all of the hakai_id's will be set (eg hakai_id, hakai_sample_id etc)
  const uniqueResults = data.map(row =>
    uniqueSets.map(uniqueSet => {
      const ar = uniqueSet.map(field => row[field]);
      return ar[0] ? ar.join("|") : "|";
    })
  );

  // remove empty lines
  const uniqueResultsNoEmpties = uniqueSets.map((set, i) =>
    uniqueResults.map(row => row[i]).filter(r => r.replace("|", "").length)
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

  // replace pipes with commas
  return deDupArray(dupes).map(dupe =>
    dupe
      .split("|")
      .filter(r => r)
      .join(",")
  );
};
module.exports = findDuplicates;
