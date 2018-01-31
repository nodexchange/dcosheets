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

  listMajors(auth) {
    console.log('___ AUTH DONE :-) ');
    ctx.body = 'route works!';
  }
}

module.exports = Api;
