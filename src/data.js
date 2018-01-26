const { SheetDocument } = require('./sheetDocument');
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
      return db.defaults({ sheets: {} }).write();
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
  let sheetObject = {};
  sheetObject.id = '1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw';
  sheetObject.expiry = 20;
  this.activeSpreadsheet(sheetObject);
  
  }

  activeSpreadsheet(apiQuery) {
    const doc = new SheetDocument(apiQuery.id);
    this.storeSheet(apiQuery);
  }
  
  storeSheet(apiQuery) {
    let sheets = this.db.get('sheets.id')
        .value();
    return;
    // DEBUG
    lsheets = {};
    apiQuery.id = 1;
    sheets = this.db.get('sheets');
    sheets.assign(apiQuery).write();
    console.log('STORED A NEW DUDE');
  }
}

exports.Data = Data;
