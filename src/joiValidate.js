const _serializer = function () {
  const keys = [];
  const stack = [];

  const cycleReplacer = (key, value) => {
    if (stack[0] === value) {
      return "[Circular ~]";
    }

    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
  };

  return function (key, value) {
    if (stack.length > 0) {
      const thisPos = stack.indexOf(this);
      if (~thisPos) {
        stack.length = thisPos + 1;
        keys.length = thisPos + 1;
        keys[thisPos] = key;
      } else {
        stack.push(this);
        keys.push(key);
      }

      if (~stack.indexOf(value)) {
        value = cycleReplacer.call(this, key, value);
      }
    } else {
      stack.push(value);
    }

    if (Array.isArray(value) && value.placeholders) {
      const placeholders = value.placeholders;
      const arrWithPlaceholders = [];
      for (let i = 0; i < value.length; ++i) {
        if (placeholders[i]) {
          arrWithPlaceholders.push(placeholders[i]);
        }
        arrWithPlaceholders.push(value[i]);
      }

      value = arrWithPlaceholders;
    }

    return value;
  };
};

const _annotate = function (joiError) {
  if (typeof joiError !== "object") {
    return joiError.details[0].message;
  }

  const obj = JSON.parse(JSON.stringify(joiError));

  let message = "";
  for (let i = 0; i < joiError.details.length; ++i) {
    const res =
      joiError.details[i].context.missing?.reduce(
        (acc, curr) => ((acc[curr] = "-- missing --"), acc),
        {},
      ) ?? {};
    const errorKey = joiError.details[i].context.key;
    if (errorKey) {
      res[errorKey] = obj._original[errorKey] + " [" + (i + 1) + "]";
    }
    obj._original = { ...obj._original, ...res };
  }

  message =
    message +
    JSON.stringify(obj._original, _serializer(), 2)
      .replace(/_\$key\$_([, \d]+)_\$end\$_"/g, ($0, $1) => {
        return '" \u001b[31m[' + $1 + "]\u001b[0m";
      })
      .replace(/"([\w]*)": "-- missing --"/g, ($0, $1) => {
        return (
          '\u001b[41m"' + $1 + '"\u001b[0m\u001b[31m : -- missing --\u001b[0m'
        );
      })
      .replace(/"([\w]*)": "(.*?) ([[\d \]]+)"/g, ($0, $1, $2, $3) => {
        return (
          '\u001b[41m"' +
          $1 +
          '"\u001b[0m\u001b[31m : "' +
          $2 +
          '" ' +
          $3 +
          "\u001b[0m"
        );
      });

  message = message + "\n\u001b[31m";

  for (let i = 0; i < joiError.details.length; ++i) {
    message = message + "\n[" + (i + 1) + "] " + joiError.details[i].message;
  }

  message = message + "\u001b[0m";

  return message;
};

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
    abortEarly: false,
  };

  dataFlatWithMetadata.forEach((row, rowIndex) => {
    const result = joiDefObj.keys(joiDefKeys).validate(row, joiOptions);

    if (result.error) {
      const message = result.error.details
        .map((detail) => detail.message)
        .filter((msg) => msg)
        .join("\n");

      joiLog.push({
        rowIndex,
        message,
        annotate: _annotate(result.error),
      });
    }
  });
  return joiLog;
};
module.exports = joiValidate;
