
const GoogleSpreadsheet = require('google-spreadsheet');
const Authorisation = require('./authorisation');


class SheetDocument {
  constructor({ id, sheetActiveCallback, callbackObject, context }) {
    const doc = new GoogleSpreadsheet(id);
    const auth = new Authorisation(doc, () => { sheetActiveCallback(doc, callbackObject, context) });
  }
}

module.exports = SheetDocument;