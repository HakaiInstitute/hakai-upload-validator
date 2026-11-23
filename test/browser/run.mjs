// Runs the mocha specs in headless Chromium to check that the validator works
// in the browser, where the data portal uses it.
//
// esbuild bundles the specs for the browser platform, so the build fails if
// anything in src/ or config/ needs a Node built-in (fs, path, ...).
import { readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const { outputFiles } = await esbuild.build({
  stdin: {
    // Order matches mocha's default alphabetical file order
    contents: readdirSync(path.join(root, "test"))
      .filter((file) => file.endsWith(".spec.js"))
      .sort()
      .map((file) => `require("./${file}");`)
      .join("\n"),
    resolveDir: path.join(root, "test"),
  },
  bundle: true,
  platform: "browser",
  format: "iife",
  write: false,
  logLevel: "warning",
});
const specs = outputFiles[0].text;
const mochaJs = await readFile(require.resolve("mocha/mocha.js"), "utf8");

const browser = await chromium.launch();
let failures = 0;
try {
  // Far from America/Vancouver, so tests catch output that depends on the
  // browser's timezone
  const context = await browser.newContext({ timezoneId: "Pacific/Auckland" });
  const page = await context.newPage();
  page.on("pageerror", (err) => {
    console.error(`Page error: ${err.message}`);
    failures += 1;
  });

  // Serve from http://localhost so the page is a secure context, like the
  // portal over HTTPS (required for crypto.randomUUID)
  await page.route("http://localhost/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><body><div id=\"mocha\"></div></body></html>",
    })
  );
  await page.goto("http://localhost/");
  await page.addScriptTag({ content: mochaJs });
  await page.evaluate(() => window.mocha.setup({ ui: "bdd", reporter: "html" }));
  await page.addScriptTag({ content: specs });

  const results = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const tests = [];
        const runner = window.mocha.run();
        runner.on("pass", (test) => tests.push({ title: test.fullTitle(), passed: true }));
        runner.on("fail", (test, err) =>
          tests.push({ title: test.fullTitle(), passed: false, error: err.message })
        );
        runner.on("end", () => resolve(tests));
      })
  );

  for (const test of results) {
    if (test.passed) {
      console.log(`  ✓ ${test.title}`);
    } else {
      failures += 1;
      console.log(`  ✗ ${test.title}\n      ${test.error}`);
    }
  }
  const passed = results.filter((test) => test.passed).length;
  console.log(`\n${passed} passing, ${results.length - passed} failing (Chromium ${browser.version()})`);
  if (results.length === 0) {
    console.error("No tests ran");
    failures += 1;
  }
} finally {
  await browser.close();
}

process.exitCode = failures ? 1 : 0;
