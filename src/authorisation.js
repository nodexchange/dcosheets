const creds = require('./../sheets-service.json');
class Authorisation {
  constructor(doc, cb) {
    doc.useServiceAccountAuth(creds, cb);
  }
}

module.exports = Authorisation;
