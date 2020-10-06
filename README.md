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
packages that can run on both are being used, Eg. joi-browser instead of joi.

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

## Usage

Add this package to another project with `yarn add
github:HakaiInstitute/hakai-upload-validator`

New update method as of 2019-04-11 that doesn't require ssh to server:
- update validator locally
- commit new yarn.lock file that includes the updated validator commit hash to api and portal
- push updated api and portal branches to server

Update the portal (locally then push):

```bash
cd ~/hakai-data-portal-v2
yarn add github:HakaiInstitute/hakai-upload-validator
```
Commit the new yarn.lock file
```bash
git push hecate master
```


~~To update the forms-parser:~~ The forms parser is not used anymore. It has
been merged into the API.

To update the API (locally then push):

```bash
cd ~/hakai-api
yarn add github:HakaiInstitute/hakai-upload-validator
```
Commit the new yarn.lock file
```bash
git push hecate master
```

## Testing

To test the changes you have made, run:

`npm run testexcel <path-to-an-excel-file>`

This will spit out a large json file including the output to the database
(results.input) as well as a ton of debugging info about the excel file.

If you want to test further, you can include a local version of
hakai-upload-validator before pushing changes by using local paths in
package.json. Run the following, changing the paths as needed:

```bash
cd ~/hakai-data-portal-v2
yarn add file: ../hakai-upload-validator
<restart pm2 if needed>
```

```bash
cd ~/hakai-api
yarn add file: ../hakai-upload-validator
pm2 restart hakai-api
```

To run the test suite, which tests various functions used, do `npm test`.
