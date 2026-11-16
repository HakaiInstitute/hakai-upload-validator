const chai = require("chai");
chai.use(require("chai-datetime"));

const { expect } = require("chai");
require("chai-datetime");

const moment = require("moment-timezone");
const dateParser = require("../src/dateParser");
// -0800 during PST, -0700 during PDT, and -0700 year round from 2026-11-01
describe("dateParser", () => {
  it("should parse dates", () => {
    const date = "2017/01/22 12:01:22";
    expect(dateParser(date)).to.equal("2017-01-22T12:01:22-0800");
  });

  it("should parse summer dates as PDT", () => {
    expect(dateParser("2017/07/22 12:01:22")).to.equal(
      "2017-07-22T12:01:22-0700"
    );
  });

  it("should parse dates after 2026-11-01 as permanent UTC-7", () => {
    expect(dateParser("2026-12-15 10:00:00")).to.equal(
      "2026-12-15T10:00:00-0700"
    );
  });

  it("should convert dates with an explicit offset to local time", () => {
    expect(dateParser("2017-01-22 20:01:22+0000")).to.equal(
      "2017-01-22T12:01:22-0800"
    );
  });

  it("should parse Excel serial dates", () => {
    expect(dateParser("42757.5")).to.equal("2017-01-22T12:00:00-0800");
    expect(dateParser("46371.5")).to.equal("2026-12-15T12:00:00-0700");
  });

  it("should not change the global moment default timezone", () => {
    expect(moment().tz()).to.equal(undefined);
  });
});
