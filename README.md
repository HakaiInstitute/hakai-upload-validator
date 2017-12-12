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

# Usage

Add this package to another project with

yarn add github:HakaiInstitute/hakai-upload-validator

# Testing

npm test
