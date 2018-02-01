const Koa = require('koa');

const Api = require('./api');
const Database = require('./database');
const SheetsApi = require('./sheetsApi');
const VirtualObject = require('./virtualObject');

class Server {
  constructor() {
    this.initData();
    this.initVitualObject();
    this.initKoa();
    this.initApiRoutes();
    this.initSheetApi();
    this.setupDatabaseDefaults();
  }
  initData() {
    this.database = new Database({ server:this });
  }
  initVitualObject() {
    this.virtualObject = new VirtualObject({ server: this });
  }
  /* DEBUG */
  setupDatabaseDefaults() {
    this.database.setupDefaultDb(() => {
      this.testApiQuery = { 
        id:'1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw',
        expiry: 20
      };
      let result = [ 
        { id: '0', clicks: '14' },
        { id: '1', clicks: '22' },
        { id: '2', clicks: '35' },
        { id: '3', clicks: '46' },
        { id: '4', clicks: '57' } 
      ];
      // this.testStoreProducts(result);
      this.testStoreVirtualObject(result);
    });
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
    this.testApiQuery = { 
      id:'1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw',
      expiry: 20
    };
    this.sheetsApi.retrieveSheetDetails(this.testApiQuery, this.sheetInfoCallBack);
  }

  testStoreVirtualObject() {
    this.virtualObject.syncLocalDbToVirtualObject({ callback: this.testUpdateProductClick, context: this });
  }

  testUpdateProductClick(context) {
    console.log('READY??? to test clicks updates');
    const self = context;
    self.virtualObject.updateClickValue({sheetId:self.testApiQuery.id, productId:2});
    self.virtualObject.forceSync();
  }

  testStoreProducts() {
    this.sheetInfoCallBack(result, this);
  }

  sheetInfoCallBack(result, context) {
    const self = context;
    self.database.checkIfSheetExistsInDb(self.testApiQuery, result);
  }

}

new Server();
