// Every spec runs in Node (npm run test:node) and in headless Chromium
// (npm run test:browser), so it must not use Node-only APIs.
const { expect } = require("chai");

const processWorkBookAndValidate = require("../src/processWorkBookAndValidate");

// A workbook as the portal and API pass it in: one entry per sheet, rows as arrays
const chlorophyllWorkbook = () => [
  {
    name: "Hakai Metadata",
    data: [
      ["Metadata property", "Metadata value"],
      ["Data Type", "Chlorophyll"],
      ["Source", "Marine"],
      ["Analyzing lab", "Hakai"],
      ["Program", "Oceanography"],
    ],
  },
  {
    name: "Hakai Data",
    data: [
      [
        "Hakai ID",
        "Date",
        "Site ID",
        "Sampling Bout",
        "Acetone Volume",
        "Unknown Column",
      ],
      ["QCHL1", "2020-06-01", "QU39", 1, 10, "a"],
      ["QCHL2", "2020-06-01", "QU39", 1, "not a number", "b"],
      ["QCHL1", "2020-06-01", "QU39", 1, 10, "c"],
    ],
  },
];

describe("processWorkBookAndValidate", () => {
  it("should report a missing metadata sheet", () => {
    const { metadataErrorLog, submissions } = processWorkBookAndValidate(
      [{ name: "Sheet1", data: [] }],
      "someone@example.org",
      "test.xlsx",
    );
    expect(submissions).to.equal(undefined);
    expect(metadataErrorLog.map((log) => log.message)).to.deep.equal([
      "No metadata sheet found",
    ]);
  });

  it("should report an unknown data type", () => {
    const workbook = chlorophyllWorkbook();
    workbook[0].data[1] = ["Data Type", "Not a real type"];
    const { metadataErrorLog } = processWorkBookAndValidate(
      workbook,
      "someone@example.org",
      "test.xlsx",
    );
    expect(metadataErrorLog.map((log) => log.message)).to.include(
      "Could not determine definition for data type NOT A REAL TYPE",
    );
  });

  describe("with a chlorophyll workbook", () => {
    let submission;

    before(() => {
      const { metadataErrorLog, submissions } = processWorkBookAndValidate(
        chlorophyllWorkbook(),
        "someone@example.org",
        "test.xlsx",
        false,
      );
      expect(metadataErrorLog).to.be.empty;
      expect(submissions).to.have.lengthOf(1);
      [submission] = submissions;
    });

    it("should build the submission attributes from the metadata", () => {
      const attributes = submission.results["@attributes"];
      expect(submission.worksheet).to.equal("Hakai Data");
      expect(submission.form_name).to.equal("Chlorophyll:Hakai:Oceanography");
      expect(attributes.form_xmlns).to.equal(
        "http://hakai.org/xforms/SAMPLING_DATA",
      );
      expect(attributes.source_file).to.equal("test.xlsx");
      expect(attributes.submission_source).to.equal("someone@example.org");
      expect(attributes.submissionIdentifier).to.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    });

    it("should flag rows that fail Joi validation and leave them out of the inputs", () => {
      const { joiLog } = submission.validationLog;
      expect(joiLog).to.have.lengthOf(1);
      expect(joiLog[0].rowIndex).to.equal(1);
      expect(joiLog[0].message).to.equal('"Acetone Volume" must be a number');
      expect(submission.hasValidationErrors).to.equal(true);
    });

    it("should report duplicate samples", () => {
      expect(
        submission.validationLog.mlog.map((log) => log.message),
      ).to.deep.equal(["Duplicates found: QCHL1,Hakai"]);
    });

    it("should report columns it could not map", () => {
      expect(submission.debugObj.fieldsNotMapped).to.deep.equal([
        "Unknown Column",
      ]);
    });

    it("should output valid rows in levels with dates in America/Vancouver", () => {
      expect(submission.results.inputs).to.have.lengthOf(2);
      // Compare as JSON, the form the rows are sent in; it drops keys that are
      // undefined because the metadata didn't set them (e.g. process)
      expect(
        JSON.parse(JSON.stringify(submission.results.inputs[0])),
      ).to.deep.equal({
        source: "Marine",
        Chlorophyll: {
          analyzing_lab: "Hakai",
          _1__Filter_No_: "QCHL1",
          acetone_volume: 10,
        },
        Date: "2020-06-01T00:00:00-0700",
        Site_ID: "QU39",
        Sampling_Bout: 1,
      });
    });
  });
});
