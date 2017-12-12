class mlog {
  constructor(label = "") {
    this.log = [];
    this.label = label;

    ["info", "debug", "warn", "error"].forEach(logType => {
      mlog.prototype[logType] = message =>
        this.log.push({
          level: logType,
          message,
          label: this.label,
          time: new Date()
        });
    });
  }

  label(label) {
    this.label = label;
  }
  empty() {
    this.log = [];
    this.label = null;
  }

  // return all log entries
  // keys = array of keys to return or null for all keys options are ['level','message','label','time']

  dump(keys = []) {
    return this.log.map(logEntry => {
      const obj = {};
      Object.keys(logEntry)
        .filter(key => keys.includes(key) || !keys.length)
        .forEach(key => {
          obj[key] = logEntry[key];
        });
        return obj;
    });
  }
}

module.exports = mlog;
