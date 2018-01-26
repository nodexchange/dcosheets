class SheetsApi {
  constructor(server) {
    this.server = this;
  }

  init() {
    // console.log('SheetData IS ALIIIIVVVEEEE and AUTHORISED!!;');
  }

  retrieveSheetDetails(apiQuery, cb) {
    console.log('GET DETAILS HERE and... ');
    // const doc = new SheetDocument(apiQuery.id);
    cb(apiQuery, details);
  }
}

exports.SheetsApi = SheetsApi;