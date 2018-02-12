const Router = require('koa-router');
const koaBody = require('koa-body');

// spreadsheet key is the long id in the sheets URL

class Routes {
  constructor(server) {
    const router = new Router();
    this.server = server;
    this.setupRoutes(router);
    
    // app.use(_.get('/read', (ctx, name) => this.gsheetRead(ctx, name)));

    server.koa
      .use(router.routes())
      .use(router.allowedMethods());

    this.init();
  }

  init() {
    console.log('CLASS IS ALIIIIVVVEEEE;');
  }

  setupRoutes(router) {
    var self = this;
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
    router.post('/click', koaBody(), (ctx, next) => {
      if (ctx.request.header.storeclick) {
        ctx.body = 'DONE';
        console.log(ctx.request.body);
        let params = ctx.request.body.split('&');
        let sid = params[0].split('=')[1];
        let pid = params[1].split('=')[1];
        self.server.virtualObject.updateClickValue({ sheetId:sid, productId:pid });
      } else {
        ctx.body = 'sclick token mismatch...';
      }
        // => POST body
      // ctx.body = JSON.stringify(ctx.request.body);
      // let sheetObject = {};
      // sheetObject.id = ctx.request.query.id;
      // sheetObject.expiry = ctx.request.query.expiry;
      // this.server.data.activeSpreadsheet(sheetObject);
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

  listMajors(auth) {
    console.log('___ AUTH DONE :-) ');
    ctx.body = 'route works!';
  }
}

module.exports = Routes;
