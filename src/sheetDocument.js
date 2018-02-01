
const GoogleSpreadsheet = require('google-spreadsheet');
const Authorisation = require('./authorisation');


class SheetDocument {
  constructor({ id, sheetActiveCallback, callback, context }) {
    const doc = new GoogleSpreadsheet(id);
    const auth = new Authorisation(doc, () => { sheetActiveCallback(doc, callback, context) });
  }
}

module.exports = SheetDocument;