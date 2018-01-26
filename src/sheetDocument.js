
const GoogleSpreadsheet = require('google-spreadsheet');
const { Authorisation } = require('./authorisation');


class SheetDocument {
  constructor(id) {
    this.doc = new GoogleSpreadsheet('1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw');
    const auth = new Authorisation(this.doc, this.init);
    return this.doc;
  }

  init() {
    // console.log('SheetData IS ALIIIIVVVEEEE and AUTHORISED!!;');
  }
}

exports.SheetDocument = SheetDocument;