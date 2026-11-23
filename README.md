# Hakai Upload Validator

---

## Description

This package parses and validates excel files that have first been converted to
JSON, and then formats for entry into the database.

* **Parsing** - Takes JSON version of workbook and converts it to an array of
  objects with one object per row. The keys of this object are the database
  field names.
* **Validating** - Uses Joi and the Joi definition file, columns.js, to
  validate. Also reformats dates and checks for duplicates of data in same
  sheet.
* **Formatting** for entry into the database - Makes the DB entry for this
  datatype a subobject, and make certain metadata fields properties of the
  object

This project is to be used for validation in both browser and server, so
packages that can run on both are being used. Noet that as of v16 joi now 
supports browsers nativly.

## The URL where this code is deployed
as this package is used by both the hakai front end portal and api services it is included any where these services are running. currently that is on
* hecate at https://portal.hakai.org/api/ and https://portal.hakai.org/portal2/
* goose  at https://portaldev.hakai.org/api/ and https://portaldev.hakai.org/portal2/

## Changes to columns.js

There are some changes to how columns.js works. Output defaults to the categeory
name, and `matches` includes that name by default so it is optional. For
example, `gather_location: {}` is now equivalent to:

```javascript
gather_location:{
  output:'gather_location',
  matches:['gather_location', 'gather location']
}
```

Underscore/space replacement is automatically searched for, you don't need to
add it explicitly. Also `matches` is not case sensitive, but `output` is.

When there are multiple matches found, the _last_ one is taken. See CHLOROPHYLL

## Adding date/time columns

When adding a date/time to `columns.js` the column name also has to be added to `dateTimeFields.json`. If this is not done the timezone is set incorrectly on file upload.

## Installing

Install from GitHub, pinned to a release tag:

```bash
npm install github:HakaiInstitute/hakai-upload-validator#v1.1.1
```

Consumers are the API (hakai-api) and the data portal (hakai-data-portal-v2).

## Releasing a new version

1. Bump `version` in `package.json` and commit. The husky `post-commit` hook
   creates a matching `vX.Y.Z` tag.
2. Push the commit and the tag: `git push --follow-tags`.
3. In each consumer, update the dependency to the new tag and commit the
   updated lockfile.

## Testing

The API runs this package in Node and the data portal runs it in the browser,
so every spec runs in both:

```bash
npx playwright install chromium  # first time only
npm test               # both
npm run test:node      # mocha in Node
npm run test:browser   # mocha in headless Chromium
```

Both runs use the `Pacific/Auckland` timezone so tests catch output that
depends on the machine's timezone. The browser run bundles the specs with
esbuild, so it also fails if anything in `src/` or `config/` starts depending
on a Node built-in.

Run the linter with `npm run lint`. Prettier formats the code: run
`npm run format` before committing (CI runs `npm run format:check`).

To see what the validator produces for a real workbook, run:

```bash
npm run testexcel <path-to-an-excel-file>
```

This prints a large JSON document containing the database output
(`results.inputs` on each submission) and debugging info about the workbook.

## Developing against a consumer

To try local changes in the API or portal before releasing, link this package.
In `hakai-upload-validator/`:

```bash
npm install && npm link
```

Then in the consumer (`hakai-api/` or `hakai-data-portal-v2/`):

```bash
npm link hakai-upload-validator
```

To go back to the released version:

```bash
npm unlink --no-save hakai-upload-validator && npm install
```
