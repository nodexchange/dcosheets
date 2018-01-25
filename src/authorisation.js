class Authorisation {
  constructor(authCallback, doc) {
    this.init(authCallback, doc);
  }

  init(authCallbackapi, doc) {
    const creds = require('./../sheets-service.json');
    doc.useServiceAccountAuth(creds, authCallbackapi);
  }
}


exports.Authorisation = Authorisation;