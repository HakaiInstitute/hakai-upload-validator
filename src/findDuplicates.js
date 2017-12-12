const {
  arrayIncludesArray,
  deDupArray,
  arrayFindMultipleIndices
} = require("./common");

const findDuplicates = (uniqueSets, data) => {
  if (!data.length) return [];

  const headers = Object.keys(data[0]);

  // first check if we even have these sets of headers in this file
  if (!uniqueSets.some(uniqueSet => arrayIncludesArray(headers, uniqueSet)))
    return [];

  const uniqueResults = data.map(row =>
    uniqueSets.map(uniqueSet => uniqueSet.map(field => row[field]).join("|"))
  );
  const arr = uniqueSets.map((set, i) =>
    uniqueResults.map(row => row[i]).filter(r => r !== "||")
  );

  const dupes = [];
  arr.forEach(joinStringlist => {
    joinStringlist.forEach(joinedRow => {
      const dupIndices = arrayFindMultipleIndices(joinStringlist, joinedRow);
      // will all match at least once
      if (dupIndices.length > 1) {
        dupes.push(joinedRow);
      }
    });
  });
  return deDupArray(dupes);
};
module.exports = findDuplicates;
