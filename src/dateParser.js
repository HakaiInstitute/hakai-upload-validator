const moment = require("moment-timezone");

const TIMEZONE = "America/Vancouver";

/**
 * Date parsing including parsing of weird Excel dates
 * @param {String} cell the contents of the cell that we are trying to interpret as date
 * @param {String} date if cell is a time with no date, date is sent with just the date component (no time)
 * @returns {String} date/time formatted properly
 */
const dateParser = (cell, date = "") => {
  let formattedDateCell;
  // 2015/08/06 00:00:00
  const pattern1 = /(^0\.[0-9]+$)/g;
  const pattern2 = /(^[0-9]+\.[0-9]+$|^[0-9]+$)/g;
  if (pattern1.test(cell)) {
    // add date to time only fields
    const d = (date + cell - (25567 + 2)) * 86400 * 1000; // convert excel date/time to epoc
    const jdate = new Date(d);
    // javascript data object converts to utc automaticly. in order to adjust back to local time we must add the timezone offset
    const tzoffset = jdate.getTimezoneOffset() / 60;
    jdate.setHours(jdate.getHours() + tzoffset);
    formattedDateCell = moment
      .tz(jdate, TIMEZONE)
      .format("YYYY-MM-DDTHH:mm:ssZZ");
  } else if (pattern2.test(cell)) {
    // Convert Excel days since 1900-Jan-0 to iso format
    const d = moment.tz(0, TIMEZONE).subtract(70, "years").subtract(2, "days");
    d.add(Math.round(cell * 24 * 60 * 60), "seconds");
    // Need to reset hours since Excel assumes UTC times
    d.subtract(d.utcOffset(), "minutes");
    formattedDateCell = d.format("YYYY-MM-DDTHH:mm:ssZZ"); // store in iso format
  } else {
    formattedDateCell = moment
      .tz(
        cell,
        [
          "YYYY/MM/DD HH:mm:ss",
          "YYYY-MM-DD HH:mm:ssZZ",
          "YYYY-MM-DDTHH:mm:ssZZ",
          "YYYY-MM-DD HH:mm:ss",
          "YYYY-MM-DD",
          "MM-DD-YYYY",
          "MM/DD/YYYY",
          "YYYY/MM/DD",
          "MM/DD/YYYY HH:mm:ss",
        ],
        true,
        TIMEZONE,
      )
      .format("YYYY-MM-DDTHH:mm:ssZZ");
  }
  return formattedDateCell;
};

module.exports = dateParser;
