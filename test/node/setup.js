// Loaded by mocha before the specs (npm run test:node). Runs Node in the same
// timezone as the browser run (test/browser/run.mjs), far from
// America/Vancouver, so tests catch output that depends on the server's
// timezone. Set here rather than with a TZ= prefix so it works on any shell.
process.env.TZ = "Pacific/Auckland";
