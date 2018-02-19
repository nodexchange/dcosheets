const SheetDocument = require('./sheetDocument');

class SheetsApi {
  constructor(server) {
    this.server = server;
  }

  init() {
    // console.log('SheetData IS ALIIIIVVVEEEE and AUTHORISED!!;');
  }

  retrieveSheetDetails({ id }, cb) {
    const doc = new SheetDocument({
      id: id,
      sheetActiveCallback: this.sheetActiveCallback,
      context: this,
      callback: cb
    });
  }

  sheetActiveCallback(doc, callback, context) {
    const self = context;
    context.retrieveInfo(doc, self.sheetReadyCallback, callback, context);
  }

  /* Creates a new promise allowing the google-spreadsheet-api to
   * connect to the system and retrieve google sheet name
   */
  retrieveInfo(doc, sheetReadyCallback, callback, context) {
    let self = context;
    return new Promise((r) => {
      doc.getInfo((err, info) => {
        if (err) {
          console.log('[gsheetInfo] ', err);
        }
        // console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
        const sheet = info.worksheets[0];
        const rowCount = sheet.rowCount;
        console.log('sheet 1: ' + sheet.title + ' | Row Count: ' + sheet.rowCount + ' | Col Count:' + sheet.colCount);
        sheetReadyCallback(sheet, rowCount, callback, self);
        r();
      });
    });
  }

  sheetReadyCallback(sheet, rowCount, callback, context) {
    const self = context;
    // self.getRowInfo(sheet, sheetRowInfo);
    const products = [];
    self.getProductsIdsFromFirstRow(sheet, products, rowCount, self.getClickthroughValues, callback, self);
  }

  getProductsIdsFromFirstRow(sheet, products, rowCount, clickthroughCallback, callback, context) {
    sheet.getCells({
      'min-row': 1,
      'max-row': rowCount,
      'min-col': 1,
      'max-col': 1,
      'return-empty': true
    }, (err, cells) => {
      if (err) {
        console.log('[gSheetCellUpdate] ', err);
      }
      const headerCell = cells[0];
      if (headerCell.value === 'Product ID') {
        console.log('Header was correct >>>');
      }

      for (let k=1; k<cells.length; k++) {
        products.push({id: cells[k].value});
      }
      clickthroughCallback(sheet, products, rowCount, callback, context);
    });
  }

  getClickthroughValues(sheet, products, rowCount, serverClassCallback, context) {
    sheet.getCells({
      'min-row': 1,
      'max-row': rowCount,
      'min-col': 12,
      'max-col': 12,
      'return-empty': true
    }, (err, cells) => {
      if (err) {
        console.log('[gSheetCellUpdate] ', err);
      }
      const headerCell = cells[0];
      if (headerCell.value === 'Clicks') {
        console.log('CLICKS FOUND WE ARE A GO>>>');
        }

        for (let k=1; k<cells.length; k++) {
          let id = k-1;
          products[id].clicks = cells[k].value;
        }
        // FINAL CALLBACK
        serverClassCallback(products, context.server);
    });
  }

  getRowInfo(sheet) {
    // google provides some query options
    sheet.getRows({
      offset: 1,
      limit: 20,
      orderby: 'col2'
    }, (err, rows) => {
      if (err) {
        console.log('[getRowInfo] ', err);
      }
      console.log('Read ' + rows.length + ' rows');

      // the row is an object with keys set by the column headers
      rows[0].colname = 'new val';
      rows[0].save(); // this is async

      // deleting a row
      // rows[0].del();  // this is async
    });
  }

  gSheetCellUpdate(step) {
    sheet.getCells({
      'min-row': 1,
      'max-row': 5,
      'return-empty': true
    }, (err, cells) => {
      if (err) {
        console.log('[gSheetCellUpdate] ', err);
      }
      var cell = cells[0];
      console.log('Cell R' + cell.row + 'C' + cell.col + ' = ' + cell.value);

      // cells have a value, numericValue, and formula
      cell.value == '1'
      cell.numericValue == 1;
      cell.formula == '=ROW()';

      // updating `value` is "smart" and generally handles things for you
      cell.value = 123;
      cell.value = '=A1+B2'
      cell.save(); //async

      // bulk updates make it easy to update many cells at once
      cells[0].value = 1;
      cells[1].value = 2;
      cells[2].formula = '=A1+B1';
      sheet.bulkUpdateCells(cells); //async
    });
  }

  gSheetManagement() {
    doc.addWorksheet({
      title: 'my new sheet'
    }, (err, sheet) => {
      if (err) {
        console.log(err);
      }
      // change a sheet's title
      sheet.setTitle('new title'); //async

      //resize a sheet
      sheet.resize({
        rowCount: 50,
        colCount: 20
      }); //async

      sheet.setHeaderRow(['name', 'age', 'phone']); //async

      // removing a worksheet
      sheet.del(); //async
    });
  }
}

module.exports = SheetsApi;