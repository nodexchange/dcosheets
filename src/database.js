const {
  SheetDocument
} = require('./sheetDocument');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');

class Database {
  constructor({ server }) {
    this.server = server;
  }
  setupDefaultDb(resolve) {
    const resolveCall = resolve;
    const db = low(adapter).then(db => {
      // Set db default values
      this.db = db;
      resolve(this.db);
      return db.defaults({
        sheets: {}
      }).write();
      /* DEBUG */
    });
  }

  testDbStore() {
    let sheetObject = {};
    sheetObject.id = '1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw';
    sheetObject.expiry = 20;
    this.checkIfSheetExistsInDb(sheetObject);
  }

  checkIfSheetExistsInDb(apiQuery, products) {
    let dbSheetObject = this.db.get('sheets['+apiQuery.id+']')
      .value();
    let newDbSheet = this.createNewDbSheetItem(apiQuery, products);
    if (dbSheetObject.expiry) {
      // TODO (martin.wojtala) : validate expiry
      console.log('already found buddy - validate');
      return;
    }
    this.storeSheetInDb(newDbSheet);
  }
  createNewDbSheetItem(apiQuery, products) {
    let newSheet = {};
    newSheet[apiQuery.id] = {
      expiry: apiQuery.expiry,
      products: products
    };
    return newSheet;
  }
  storeSheetInDb(sheet, callback) {
    console.log('CALL BACK BABY <3');
    // why save here, you have no items...
    // get them first...
    let sheets = this.db
      .get('sheets')
      .assign(sheet)
      .write();
    if (callback) {
      callback();
    }
    console.log('STORED A NEW DUDE');
  }

  syncData(virtualObject, callback) {
    this.currentSyncProgressId = 0;
    this.finalCallback = callback;
    this.syncVirtualSheetToDb(this.currentSyncProgressId, virtualObject, this);
  }

  syncVirtualSheetToDb(id, virtualObject, context) {
    const self = context;
    self.virtualObject = virtualObject;
    const virtualSheetId = Object.keys(virtualObject.sheets)[id];
    if (virtualSheetId) {
      console.log('[DB syncVirtualSheetToDb] continue syncing', id, virtualSheetId);
      self.syncNextSheet(virtualSheetId, self, self.syncVirtualSheetToDb);
    } else {
      console.log('[DB syncVirtualSheetToDb] YOU ARE DONE SYNCING', id, virtualSheetId);
      self.finalCallback();
    }
  }

  syncNextSheet(sheetId, context, syncVirtualSheetToDB) {
    const self = context;
    let dbSheetObject = self.db.get('sheets['+sheetId+']')
      .value();
    let matchingVirtualSheet = self.virtualObject.sheets[sheetId];
    console.log(matchingVirtualSheet);
    if (!matchingVirtualSheet || !dbSheetObject) {
      console.log('[DB SyncNextSheet], no matching virtual sheet', self.currentSyncProgressId);
    } else {
      if (dbSheetObject.products && matchingVirtualSheet.products) {
        if (dbSheetObject.products[0] && matchingVirtualSheet.products[0]) {
          self.server.arrayUtils.compareAndUpdate(dbSheetObject.products, matchingVirtualSheet.products);
          // console.log('>>>> ALIGNED HERE', dbSheetObject.products);
          self.server.sheetsApi.updateGSheet(sheetId, dbSheetObject, self.currentSheetSyncCompleted, self.saveDatabaseOnSyncComplete, syncVirtualSheetToDB, self);
        }
      } else {
        console.log('ERROR Syncing, products [not found] or products [not defined]', self.currentSyncProgressId);
        self.currentSheetSyncCompleted(syncVirtualSheetToDB, context);
      }
    }
  }
  // callback = this.syncVirtualSheetToDb
  saveDatabaseOnSyncComplete(context) {
    const self = context;
    self.db.write(); // debug disable
  }
  currentSheetSyncCompleted(syncVirtualSheetToDB, context) {
    const self = context;
    self.currentSyncProgressId++;
    if (syncVirtualSheetToDB) {
      syncVirtualSheetToDB(self.currentSyncProgressId, self.virtualObject, self);
    }
  }


  fetchSheetsData() {
    let dbSheetObject = this.db.get('sheets').cloneDeep().value();
    return dbSheetObject;
  }

  get server() {
    return this._server;
  }

  // This defines a "setter". If you write something like:
  //
  //   let rectangle = new Rectangle(5, 7);
  //   rectangle.height = 10;
  //
  // the code in the method will be executed with an
  // argument of value 10.
  set server(value) {
    if (typeof value === 'undefined') {
      throw new Error('"server" is required.');
    }

    this._server = value;
  }
}

module.exports = Database;
