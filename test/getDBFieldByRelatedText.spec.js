const { expect } = require("chai");

const columnSchema = require("../config/columns");
const getDBFieldByRelatedText = require("../src/getDBFieldByRelatedText");

describe("getDBFieldByRelatedText", () => {
  it("should get a match for a value and schema and be case insensitive", () => {
    expect(getDBFieldByRelatedText("a250:a365", columnSchema.SUVA)).to.equal(
      "a250_a365",
    );
    expect(
      getDBFieldByRelatedText(
        "ph4_after_FIELD_value",
        columnSchema.YSI_CALIBRATION,
      ),
    ).to.equal("ph4_after_field_value");
    expect(
      getDBFieldByRelatedText(
        "Ph4 After Field Value",
        columnSchema.YSI_CALIBRATION,
      ),
    ).to.equal("ph4_after_field_value");
  });
});
