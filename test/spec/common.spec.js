const { expect } = require("chai");

const {
  getKeyByValue,
  deDupArray,
  toUpperCaseArray,
  arrayIncludesArray,
  arrayFindMultipleIndices
} = require("../../src/common.js");

describe("Common functions", () => {
  const testArray = ["a", "b", "b", "c"];
  describe("deDupArray", () => {
    it("should return a new array with duplicate values removed", () => {
      expect(deDupArray(testArray)).to.deep.equal(["a", "b", "c"]);
    });
  });

  describe("toUpperCaseArray", () => {
    it("should return a new array with uppercase values", () => {
      expect(toUpperCaseArray(testArray)).to.deep.equal(["A", "B", "B", "C"]);
      expect(toUpperCaseArray([])).to.deep.equal([]);
    });
  });

  describe("arrayIncludesArray", () => {
    it("should return true if an array contains all of the values of another array", () => {
      expect(arrayIncludesArray(testArray, ["a", "c"])).to.be.true;
      expect(arrayIncludesArray(testArray, [])).to.be.true;
      expect(arrayIncludesArray([], [])).to.be.true;
    });
  });

  describe("getKeyByValue", () => {
    it("should return the key associated with a value in an object", () => {
      expect(getKeyByValue({ a: 1, b: 2, c: 2, e: 3 }, 2)).to.equal("b");
    });
  });

  describe("arrayFindMultipleIndices", () => {
    it("should return an array with indices of value found", () => {
      expect(
        arrayFindMultipleIndices(["a", "c", "e", "g", "e"], "e")
      ).to.deep.equal([2, 4]);
      expect(arrayFindMultipleIndices([], "e")).to.deep.equal([]);
      expect(
        arrayFindMultipleIndices(["a", "c", "e", "g", "e"], "")
      ).to.deep.equal([]);
    });
  });
});
