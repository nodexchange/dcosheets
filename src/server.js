const Koa = require('koa');

const { Api } = require('./api');
const { Data } = require('./data');
const { SheetsApi } = require('./sheetsApi');

class Server {
  constructor() {
    this.initData();
    this.initKoa();
    this.initApiRoutes();
    this.initSheetApi();
  }
  initData() {
    this.data = new Data();
  }
  initKoa() {
    this.koa = new Koa();
    this.koa.listen(3000);
    console.log('listening on port 3000');
  }
  initApiRoutes() {
    this.api = new Api(this);
  }
  initSheetApi() {
    this.sheetsApi = new SheetsApi(this);
  }

}

new Server();
