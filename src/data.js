const {
  SheetDocument
} = require('./sheetDocument');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');

class Data {
  constructor(server) {
    this.server = server;

    // // Set some defaults
    // db.defaults({ posts: [], user: {}, count: 0 })
    const db = low(adapter).then(db => {
      // Set db default values
      this.db = db;
      this.testDbStore();
      return db.defaults({
        sheets: {}
      }).write();
      /* DEBUG */
    });

    // // Add a post
    // db.get('posts')
    //   .push({ id: 1, title: 'lowdb is awesome'})
    //   .write()

    // // Set a user using Lodash shorthand syntax
    // db.set('user.name', 'typicode')
    //   .write()

    // // Increment count
    // db.update('count', n => n + 1)
    //   .write()
    // localhost:3000/sheet?id=1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw&expiry=20

  }
  testDbStore() {
    console.log('Simulate an API Route call [testDBStore] ?');
    let sheetObject = {};
    sheetObject.id = '1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw';
    sheetObject.expiry = 20;
    this.checkIfSheetExists(sheetObject);

  }

  checkIfSheetExists(apiQuery) {
    let sheet = this.db.get('sheets['+apiQuery.id+']')
      .value();
    
    console.log(' :: ', sheet);
    
    if (sheet.expiry) {
      // TODO (martin.wojtala) : validate expiry
      console.log('already found buddy');
      return;
    }
    console.log('NEED A NEW ONE BOY');
    sheet = this.createNewDbSheetItem(apiQuery);
    this.server.sheetsApi.retrieveSheetDetails(sheet, this.storeSheet);
  }
  createNewDbSheetItem(apiQuery) {
    let newSheet = {};
    newSheet[apiQuery.id] = {
      expiry: apiQuery.expiry,
      products: {}
    };
    return newSheet;
  }
  storeSheet(sheet) {
    console.log('CALL BACK BABY <3');
    // why save here, you have no items...
    // get them first... 
    let sheets = this.db
      .get('sheets')
      .assign(sheet)
      .write();
    console.log('STORED A NEW DUDE');
  }
}

exports.Data = Data;