let chai = require('chai'),
  path = require('path');

chai.should();
let expect = chai.expect;

let Data = require(path.join(__dirname, '..', 'src/data'));

describe('Data', () => {
  describe('#constructor()', () => {
    it('requires two numerical arguments', () => {
      (() => {
        new Data();
      }).should.throw(Error);

      (() => {
        new Data('foo', 'bar');
      }).should.throw(Error);

      (() => {
        new Data({ server: ()=>{} });
      }).should.not.throw(Error);
    });
  });

  describe('setupDefaultDb (async)', () => {
    let data, testPromise, result;

    beforeEach(() => {
      data = new Data({ server: ()=>{} });
    });

    it('returns the default sheet', async () => {
      testPromise = new Promise( async (resolve, reject) => {
        try {
          result = await data.setupDefaultDb(resolve, reject);
        } catch (error) {
          console.log('ERROR');
        }
      });

      result = await testPromise;
      expect(typeof result).to.equal('object');
    });
  });

  describe('check sheet reading', () => {
    let data;

    beforeEach(() => {
      data = new Data({ server: ()=>{} });
    });

    it('returns the circumference', () => {
      data.circumference.should.equal(60);
    });

    it('can not be changed', () => {
      (() => {
        data.circumference = 1000;
      }).should.throw(Error);
    });
  });

  /* TODO(martin): */
  /*
  describe('verify expiry date', () => {
    let data;

    beforeEach(() => {
      Data = new Data(10, 20);
    });

    it('returns the circumference', () => {
      Data.circumference.should.equal(60);
    });

    it('can not be changed', () => {
      (() => {
        Data.circumference = 1000;
      }).should.throw(Error);
    });
  });
  */

  describe('create new db sheet item return', () => {
    let data;
    let sheetObject = {};
    sheetObject.id = '1nbBCOxUxo9DcFjH-Vfzx2iqTyDcP00dKCc5YUCPK2Dw';
    sheetObject.expiry = 20;

    beforeEach(() => {
      data = new Data({ server:()=>{} });
    });

    it('verify if api object is returned', () => {
      let testNewSheet = data.createNewDbSheetItem(sheetObject)[sheetObject.id];
      expect(typeof testNewSheet).to.equal('object');
    });
  });

  describe('store a sheet', () => {
    let Data;

    beforeEach(() => {
      Data = new Data(10, 20);
    });

    it('returns the circumference', () => {
      Data.circumference.should.equal(60);
    });

    it('can not be changed', () => {
      (() => {
        Data.circumference = 1000;
      }).should.throw(Error);
    });
  });

});