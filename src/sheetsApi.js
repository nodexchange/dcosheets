const SheetDocument = require('./sheetDocument');

class SheetsApi {
  constructor(server) {
    this.server = server;
  }

  init() {
    // console.log('SheetData IS ALIIIIVVVEEEE and AUTHORISED!!;');
  }

  retrieveSheetDetails({ id }, callbackObject) {
    const doc = new SheetDocument({
      id: id,
      sheetActiveCallback: this.sheetActiveCallback,
      context: this,
      callbackObject: callbackObject
    });
  }

  sheetActiveCallback(doc, callbackObject, context) {
    const self = context;
    context.retrieveInfo(doc, callbackObject, context);
  }

  updateGSheet(sheetId, dbSheetObject, currentSheetSyncCompleted, saveDbOnSyncComplete, syncVirtualSheetToDB, context) {
    // console.log('[sheetsApi](updateGSheet) ', dbSheetObject);
    console.log('=================== sheetsApi ==============================');
    console.log(sheetId);
    const callbackObject = {
      dbSheetObject: dbSheetObject,
      currentSheetSyncCompleted:currentSheetSyncCompleted,
      saveDbOnSyncComplete: saveDbOnSyncComplete,
      syncVirtualSheetToDB: syncVirtualSheetToDB,
      gSheetSyncCompleted: this.gSheetSyncCompleted,
      context: context,
    }
    this.retrieveSheetDetails({id:sheetId}, callbackObject);
    // done 
  }

  gSheetSyncCompleted({syncVirtualSheetToDB, currentSheetSyncCompleted, saveDbOnSyncComplete, context}) {
    saveDbOnSyncComplete(context);
    currentSheetSyncCompleted(syncVirtualSheetToDB, context);
  }

  /* Creates a new promise allowing the google-spreadsheet-api to
   * connect to the system and retrieve google sheet name
   */
  retrieveInfo(doc, callbackObject, context) {
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
        self.sheetReadyCallback(sheet, rowCount, callbackObject, self);
        r();
      });
    });
  }

  sheetReadyCallback(sheet, rowCount, callbackObject, context) {
    const self = context;
    // self.getRowInfo(sheet, sheetRowInfo);
    const products = [];
    self.getProductsIdsFromFirstRow(sheet, products, rowCount, callbackObject, self);
  }

  getProductsIdsFromFirstRow(sheet, products, rowCount, callbackObject, context) {
    const self = context;
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

      for (let k=1; k<cells.length - 1; k++) {
        products.push({id: cells[k].value});
      }
      self.getClickthroughValues(sheet, products, rowCount, callbackObject, context);
    });
  }

  getClickthroughValues(sheet, products, rowCount, callbackObject, context) {
    const self = context;
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
        const dbObject = callbackObject.dbSheetObject;
        let sheetsWillNeedUpdating = false;
        for (let k=1; k<cells.length - 1; k++) {
          let id = k - 1;
          for (let i=0; i<dbObject.products.length; i++) {
            if (dbObject.products[i].id === products[id].id) {
              let currentClicks = cells[k].value;
              // check if value needs increasing;
              if (dbObject.products[i].clicksToUpdate) {
                const clicksToAdd = parseInt(dbObject.products[i].clicksToUpdate);
                if (clicksToAdd > 0) {
                  currentClicks = parseInt(currentClicks) + clicksToAdd;
                  dbObject.products[i].clicksToUpdate = '0';
                  sheetsWillNeedUpdating = true;
                }
              }
              dbObject.products[i].clicks = currentClicks.toString();;
              cells[k].value = currentClicks.toString();
            }
          }
          // products[id].clicks = cells[k].value;
        }

        if (sheetsWillNeedUpdating) {
          sheet.bulkUpdateCells(cells);
        }
      }
      callbackObject.gSheetSyncCompleted(callbackObject);
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