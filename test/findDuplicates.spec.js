/* eslint no-unused-expressions: 0 */
const findDuplicates = require("../src/findDuplicates");

// this file has two rows of chlorophyl data with same filter_no and analyzing_lab
const input = require("./input/findDuplicatesTestData");
const uniqueSets = require("../config/uniqueSets");

const { expect } = require("chai");

describe("Find duplicates", () => {
  let inputWithoutAnalyzingLab;
  before(() => {
    inputWithoutAnalyzingLab = input.map(row => {
      const { analyzing_lab, ...withoutAnalyzingLab } = row;
      return withoutAnalyzingLab;
    });
  });
  it("should find duplicates when two rows contain same hakai id and analyzing lab", () => {
    const duplicatesFound = findDuplicates(uniqueSets, input);
    expect(duplicatesFound).to.not.be.empty;
  });
  it("should find duplicates also if analyzing lab is empty (but header exists)", () => {
    const duplicatesFound = findDuplicates(
      uniqueSets,
      inputWithoutAnalyzingLab
    );

    expect(duplicatesFound).to.not.be.empty;
  });
  it("should not find duplicates if one record has a value for analyzing lab and the other doesnt", () => {
    inputWithoutAnalyzingLab[0].analyzing_lab = "HAKAI";
    inputWithoutAnalyzingLab[1].analyzing_lab = undefined;
    const duplicatesFound = findDuplicates(
      uniqueSets,
      inputWithoutAnalyzingLab
    );
    expect(duplicatesFound).to.be.empty;
  });
  it("should find duplicates if neither record has a value for analyzing lab", () => {
    inputWithoutAnalyzingLab[0].analyzing_lab = undefined;
    inputWithoutAnalyzingLab[1].analyzing_lab = undefined;
    const duplicatesFound = findDuplicates(
      uniqueSets,
      inputWithoutAnalyzingLab
    );
    expect(duplicatesFound).to.not.be.empty;
  });
  it("should not find duplicates if both rows have different non-null values for analyzing_lab", () => {
    inputWithoutAnalyzingLab[0].analyzing_lab = "Lab 1";
    inputWithoutAnalyzingLab[1].analyzing_lab = "Lab 2";
    const duplicatesFound = findDuplicates(
      uniqueSets,
      inputWithoutAnalyzingLab
    );
    expect(duplicatesFound).to.be.empty;
  });
});
