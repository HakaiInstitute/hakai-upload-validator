const { expect } = require("chai");

const dateParser = require("../../src/dateParser");
// or -700 during PDT
describe("dateParser", () => {
  it("should parse dates", () => {
    const date = "2017/01/22 12:01:22";
    expect(dateParser(date)).to.equal("2017-01-22T12:01:22-0800" );
  });
});
