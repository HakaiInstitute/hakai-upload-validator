const chai = require('chai');
chai.use(require('chai-datetime'));

const { expect } = require("chai");
require('chai-datetime');

const dateParser = require("../src/dateParser");
// or -700 during PDT
describe("dateParser", () => {
  it("should parse dates", () => {
    const date = "2017/01/22 12:01:22";
    expect(dateParser(date)).to.equal("2017-01-22T12:01:22-0800");
  });
  it("should should parse 'pattern1' dates", () => {
    const cell = "0.993838";
    const date = "39341";
    expect(dateParser(cell, date)).to.equal("2017-01-22T12:01:22-0800");
  });
  it("should parse 'pattern2' dates", () => {
    // 39341 should be September 16, 2007
    // const date = 39341;
    // for some reason this doesnt work
  });
});



console.log(typeof dateParser(39341));
