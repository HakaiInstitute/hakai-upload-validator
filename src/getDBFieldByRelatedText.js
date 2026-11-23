const { toUpperCaseArray, deDupArray } = require("./common.js");

/**
 *   Search for key in fieldGroup. includes searching 'ouput','matches' array
 *   eg getDBFieldByRelatedText('Watershed ID',columnSchema['SUVA']) returns 'watershed'
 *   @param {String} text Value to match. Case insensitive matches anything in 'matches' array, or the 'output' property, or the name of the object itself
 *   @param {Object} fieldGroup an object from columns.js, eg columns.NITRATES
 *   @returns {String} the proper field name to use
 */
const getDBFieldByRelatedText = (text = "", fieldGroup) => {
  const getAllPossibleMatches = (arr) => {
    const withUnderLines = arr.map((matches) => matches.replace(/ /g, "_"));
    const withSpaces = arr.map((matches) => matches.replace(/_/g, " "));
    return deDupArray([...arr, ...withUnderLines, ...withSpaces]);
  };

  if (!fieldGroup) return false;

  const matches = Object.keys(fieldGroup)
    // ignore the _joi properties
    .filter((f) => f.charAt(0) !== "_")
    .map((fieldName) => ({
      fieldName,
      matches: deDupArray(
        toUpperCaseArray(
          getAllPossibleMatches(
            (fieldGroup[fieldName].matches || [])
              .concat([fieldName, fieldGroup[fieldName].output])
              .filter((ele) => typeof ele === "string"),
          ),
        ),
      ),
    }));
  // console.log(matches);
  const m = matches
    .filter((mo) => mo.matches.includes(text.toUpperCase()))
    .pop();
  if (m) return m.fieldName;
  return false;
};

module.exports = getDBFieldByRelatedText;
