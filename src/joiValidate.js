const Joi = require("joi-browser");

/**
 * This functions runs the Joi validation on the JSON, after the metadata has been added.
 * Returns an array of objects, with rowIndex of the row that caused an error
 * @param {Array} dataFlatWithMetadata
 * @param {Object} joiDefObj
 * @param {Array} joiDefKeys
 * @returns {Array} Log entry for each row that has errors in it
 */
const joiValidate = (dataFlatWithMetadata, joiDefObj, joiDefKeys) => {
  const joiLog = [];
  const joiOptions = {
    allowUnknown: true,
    abortEarly: false
  };

  dataFlatWithMetadata.forEach((row, rowIndex) => {
    const result = Joi.validate(row, joiDefObj.keys(joiDefKeys), joiOptions);
    if (result.error) {
      const message = result.error.details
        .map(detail => detail.message)
        .filter(msg => msg)
        .join("\n");
      //
      // reduce(
      //   (str, obj) => [str, obj.message].join("\n"),
      //   ""
      // );
      // logger.error(o);
      joiLog.push({
        rowIndex,
        message,
        annotate: result.error.annotate()
      });
    }
  });
  return joiLog;
};
module.exports = joiValidate;
