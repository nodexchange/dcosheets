class VirtualObject {
  constructor({server}) {
    this.server = server;
    this.virtualObject = {sheets:{}};
  }
  forceSync() {
    console.log('HERE???');
    this.syncVirtualObjectToLocalDb();
  }
  syncLocalDbToVirtualObject({callback, context}) {
    const sheets = this.server.database.fetchSheetsData();
    this.virtualObject = sheets;
    callback(context);
  }
  syncVirtualObjectToLocalDb() {
    this.server.database.syncData(this.virtualObject);
  }
  updateClickValue({sheetId, productId}) {
    if (!this.virtualObject[sheetId].expiry) {
      this.virtualObject[sheetId] = {};
      this.virtualObject[sheetId].products = {};
    }
    const products = this.virtualObject[sheetId].products;
    for (let i=0; i < products.length; i++) {
      if (products[i].id === productId || parseInt(products[i].id) === productId) {
        products[i].clicks ++;
        products[i].clicks = products[i].clicks.toString();
      }
    }
    this.virtualObject[sheetId].products = products;
  }
}

module.exports = VirtualObject;
