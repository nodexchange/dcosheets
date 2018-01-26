const Router = require('koa-router');
// spreadsheet key is the long id in the sheets URL

class Api {
  constructor(server) {
    const router = new Router();
    this.server = server;

    router.get('/', (ctx, next) => {
      ctx.body = 'Hello World!';
    });
    router.get('/writeTest', (ctx, next) => {
      ctx.body = 'WRITE TEST!';
      this.writeToACell(); // async... will do it whenever
    });

    router.use('/gsheetInfo', async (ctx, next) => {
      await this.retrieveInfo()
      await next()
    }).get('/gsheetInfo', async (ctx, next) => {
      ctx.body = 'DONE READING is '+ this.sheet.title;
    });

    router.get('/sheet', (ctx, next) => {
      ctx.body = 'DONE READING is';
      // localhost:3000/sheet?id=1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw&expiry=20
      let sheetObject = {};
      sheetObject.id = ctx.request.query.id;
      sheetObject.expiry = ctx.request.query.expiry;
      this.server.data.activeSpreadsheet(sheetObject);
    });

    // app.use(_.get('/read', (ctx, name) => this.gsheetRead(ctx, name)));

    server.koa
      .use(router.routes())
      .use(router.allowedMethods());

    this.init();
  }

  init() {
    console.log('CLASS IS ALIIIIVVVEEEE;');
  }

  /* Creates a new promise allowing the google-spreadsheet-api to
   * connect to the system and retrieve google sheet name
  */
  retrieveInfo() {
    return new Promise((r) => {
      this.doc.getInfo((err, info) => {
        if (err) {
          console.log('[gsheetInfo] ', err);
        }
        console.log('Loaded doc: '+info.title+' by '+info.author.email);
        this.sheet = info.worksheets[0];
        console.log('sheet 1: '+this.sheet.title+' '+this.sheet.rowCount+'x'+this.sheet.colCount);
        r();
      });
    });
  }

  writeToACell() {
    this.sheet.getCells({
      'min-row': 3,
      'max-row': 3,
      'return-empty': true
    }, (err, cells) => {
      if (err) {
        console.log('[gSheetCellUpdate] ', err);
      }
      var cell = cells[0];
      console.log('Cell R'+cell.row+'C'+cell.col+' = '+cell.value);
      // bulk updates make it easy to update many cells at once
      cells[0].value = 'MARTIN TEST';
      this.sheet.bulkUpdateCells(cells); //async
    });
  }

  list(ctx) {
    const names = Object.keys(this.db);
    ctx.body = 'pets: ' + names.join(', ');
  }

  show(ctx, name) {
    const pet = this.db[name];
    if (!pet) return ctx.throw('cannot find that pet', 404);
    ctx.body = pet.name + ' is a ' + pet.species;
  }

  gsheet(ctx, name) {
    ctx.body = 'ready';
    console.log(ctx.request.query);
  }

  gsheetWriteTest(ctx, name) {

  }

  gsheetRead(ctx, name) {

  }

  getRowInfo() {
    // google provides some query options
    sheet.getRows({
      offset: 1,
      limit: 20,
      orderby: 'col2'
    }, ( err, rows ) => {
      if (err) {
        console.log('[getRowInfo] ', err);
      }
      console.log('Read '+rows.length+' rows');

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
      console.log('Cell R'+cell.row+'C'+cell.col+' = '+cell.value);

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
      sheet.resize({rowCount: 50, colCount: 20}); //async

      sheet.setHeaderRow(['name', 'age', 'phone']); //async

      // removing a worksheet
      sheet.del(); //async
    });
  }

  listMajors(auth) {
    console.log('___ AUTH DONE :-) ');
    ctx.body = 'route works!';
  }
}

exports.Api = Api;