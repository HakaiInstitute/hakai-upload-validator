const getKeyByValue = (object, value) =>
  Object.keys(object).find(key => object[key] === value);

/**
 * Returns a new array with duplicate values removed
 * @param {Array} arr
 * @returns {Array}
 */
const deDupArray = arr => [...new Set(arr)];

/**
 * Returns a new array that is all uppercase
 * @param {Array} arr
 * @returns {Array}
 */
const toUpperCaseArray = arr => arr.map(str => str.toUpperCase());

/**
 * Returns true if arr1 contains all the values in arr2
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {Boolean}
 */
const arrayIncludesArray = (arr1, arr2) =>
  deDupArray([...arr1, ...arr2]).length === deDupArray(arr1).length;

/**
 * Finds occurances of val in array. returns array of indices that match or [] if no matches
 * @param {Array} arr
 * @param {Any} val
 * @returns {Array}
 */
const arrayFindMultipleIndices = (arr, val) =>
  arr.reduce((a, e, i) => (e === val ? a.concat(i) : a), []);

module.exports = {
  deDupArray,
  getKeyByValue,
  toUpperCaseArray,
  arrayIncludesArray,
  arrayFindMultipleIndices
};
