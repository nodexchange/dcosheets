class VirtualObject {
  constructor({server}) {
    this.server = server;
    this.virtualObject = {sheets:{}};
  }
  forceSync(syncCompleteCallback) {
    console.log('[VB forceSync]', this.virtualObject);
    this.syncVirtualObjectToLocalDb(syncCompleteCallback);
  }
  syncLocalDbToVirtualObject({callback, context}) {
    const sheets = this.server.database.fetchSheetsData();
    this.virtualObject = sheets;
    callback(context);
  }
  syncVirtualObjectToLocalDb(syncCompleteCallback) {
    this.server.database.syncData(this.virtualObject, syncCompleteCallback);
  }
  syncComplete() {
    console.log('>>>>>>>>>>> YOU DID IT BRO <<<<<<<<<<<<');
  }
  updateClickValue({sheetId, productId}) {
    if (!this.virtualObject.sheets[sheetId]) {
      console.log(' SHEET NOT IN THE MEMORY --- GET IT')
      this.virtualObject.sheets[sheetId] = {};
      this.virtualObject.sheets[sheetId].products = [];
      this.virtualObject.sheets[sheetId].products.push({"id":productId, clicks:0, clicksToUpdate:0});
    }
    const products = this.virtualObject.sheets[sheetId].products;
    for (let i=0; i < products.length; i++) {
      if (products[i].id === productId || parseInt(products[i].id) === productId) {
        products[i].clicksToUpdate = parseInt(products[i].clicksToUpdate) + 1;
        products[i].clicksToUpdate = products[i].clicksToUpdate.toString();
      }
    }
    this.virtualObject.sheets[sheetId].products = products;
    // console.log(this.virtualObject.sheets[sheetId].products[0]);
  }
}

module.exports = VirtualObject;
