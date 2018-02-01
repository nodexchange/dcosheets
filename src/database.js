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
  storeSheetInDb(sheet) {
    console.log('CALL BACK BABY <3');
    // why save here, you have no items...
    // get them first...
    let sheets = this.db
      .get('sheets')
      .assign(sheet)
      .write();
    console.log('STORED A NEW DUDE');
  }

  syncData(virtualObject) {
    this.currentSyncProgressId = 0;
    this.syncVirtualSheetToDb(this.currentSyncProgressId, virtualObject, this.syncNextSheet);
    console.log(); // "a"
  }

  syncVirtualSheetToDb(id, virtualObject, callback) {
    const sheetId = Object.keys(virtualObject)[id];
    if (sheetId) {
      console.log('continue syncing', sheetId);
    } else {
      console.log('YOU ARE DONE SYNCING');
    }
  }

  syncNextSheet(context) {
    const self = context;
    self.currentSyncProgressId++;
    console.log('HERE>>>');
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
