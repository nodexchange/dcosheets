const Koa = require('koa');

const Api = require('./api');
const Data = require('./data');
const SheetsApi = require('./sheetsApi');

class Server {
  constructor() {
    this.initData();
    this.initKoa();
    this.initApiRoutes();
    this.initSheetApi();

    /* DEBUG */

    this.testInfoRetrieve();
  }
  initData() {
    this.data = new Data({ server:this });
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
  testInfoRetrieve() {
    // ;
    let testApiQuery = { id:'1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw' };
    this.sheetsApi.retrieveSheetDetails(testApiQuery, this.sheetInfoCallBack);
  }

  sheetInfoCallBack(result) {
    console.log('[sheetInfoCallBack] HERE???', result);
  }

}

new Server();
