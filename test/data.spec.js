let chai = require('chai'),
  path = require('path');

chai.should();
const expect = chai.expect;

let Data = require(path.join(__dirname, '..', 'src/data'));
let testApiCall = 'localhost:3000/sheet?id=1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw&expiry=20';

describe('Data', () => {
  describe('#constructor()', () => {
    it('requires a class argument', () => {
      (() => {
        new Data();
      }).should.throw(Error);
    });
    it('wrong type argument', () => {
      (() => {
        new Data('hello world');
      }).should.throw(Error);
    });
    it('a class passed in', () => {
      (() => {
        new Data(() => {});
      }).should.not.throw(Error);
    });
  });
  describe('Promise test for default DB', () => {
    let data;

    beforeEach(() => {
      data = new Data(() => {});
    });

    async function add(a, b) {
      return Promise.resolve(a + b);
    }

    it('returns the width', () => {
      data.setupDatabaseDefaults().should.be.a(object);
    });

    it('3 + 3 is 6', async () => {
      const p = await add(3, 3)
      expect(p).to.equal(6);
    });
  });
});
// .should.not.throw(Error);