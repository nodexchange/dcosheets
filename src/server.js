const Koa = require('koa');
const app = new Koa();

const { Api } = require('./api');
const { Authorisation } = require('./authorisation');

const GoogleSpreadsheet = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw');

const db = {
  tobi: { name: 'tobi', species: 'ferret' },
  loki: { name: 'loki', species: 'ferret' },
  jane: { name: 'jane', species: 'ferret' }
};

const initApi = () => {
  const api = new Api(app, db, doc);
}

const authorisation = new Authorisation(initApi, doc);

app.listen(3000);
console.log('listening on port 3000');
