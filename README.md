# Hakai Upload Validator

--------------------------------------------------------------------------------

## Description

This package parses and validates excel files that have first been converted to JSON, and then formats for entry into the database.

- **Parsing** - Takes JSON version of workbook and converts it to an array of objects with one object per row. The keys of this object are the database field names.
- **Validating** - Uses Joi and the Joi definition file, columns.js, to validate. Also reformats dates and checks for duplicates of data in same sheet.
- **Formatting** for entry into the database - Makes the DB entry for this datatype a subobject, and make certain metadata fields properties of the object

This project is to be used for validation in both browser and server, so packages that can run on both are being used, Eg. joi-browser instead of joi.

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

Underscore/space replacement is automatically searched for, you don't need to add it explicitly. Also `matches` is not case sensitive, but `output` is.

When there are multiple matches found, the _last_ one is taken. See CHLOROPHYLL

## Usage

Add this package to another project with `yarn add
github:HakaiInstitute/hakai-upload-validator`

Update the portal:

```javasript
cd ~/hakai-data-portal-v2
npm upgrade hakai-upload-validator
npm run build:hecate
pm2 restart hakai-data-portal-v2
```

To update the forms-parser:

```javasript
cd ~/hakai-database/Form-Parser/EIMS
npm upgrade hakai-upload-validator
pm2 restart eims-form-parser
```

## Testing

To test the changes you have made, run:

`npm run testexcel <path-to-an-excel-file>`

This will spit out a large json file including the output to the database
(results.input) as well as a ton of debugging info about the excel file.

If you want to test further, you can include a local version of
hakai-upload-validator before pushing changes by using local patch in
package.json, See <https://docs.npmjs.com/files/package.json#local-paths>

To run the test suite, which tests various functions used, do `npm test`.
