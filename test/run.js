'use strict';

const
    pkg = require('../package.json')
  , request = require('superagent')
  , chai = require('chai')
  , expect = chai.expect
  ;

describe(pkg.name + '/index.js test service', function() {

  describe('post-istexid.js', function () {

    it('checks the body length', function(done) {
      request
      .post('http://127.0.0.1:3000/')
      .end(function(err, res) {
        expect(err.status).to.be.not.null;
        expect(err.status).to.equal(400);
        done();
      })
    });

    it('checks presence of corpusName', function(done) {
      request
      .post('http://127.0.0.1:3000/')
      .send([{ idIstex: '1234567890123456789012345678901234567890', corpus: 'elsevier' }])
      .end(function(err, res) {
        expect(err).to.be.not.null;
        expect(err.status).to.equal(400);
        done();
      });
    });

    it('returns an ARK for one idIstex', function(done) {
      request
      .post('http://127.0.0.1:3000/')
      .send([{ idIstex: '1234567890123456789012345678901234567890', corpusName: 'elsevier' }])
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body['1234567890123456789012345678901234567890']).to.match(/^ark:\/67375\/6H6-[A-Z0-9]{8}-[A-Z0-9]$/);
        done();
      });
    });

    it('returns an ARK for two idIstex', function(done) {
      request
      .post('http://127.0.0.1:3000/')
      .send([{ idIstex: '1234567890123456789012345678901234567890', corpusName: 'elsevier' },
             { idIstex: '1234567890123456789012345678901234567891', corpusName: 'wiley' }
            ])
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body['1234567890123456789012345678901234567890']).to.be.not.null;
        expect(res.body['1234567890123456789012345678901234567890'].length).to.equal(25);
        done();
      });
    });

    it('checks if corpusName exists', function(done) {
      request
      .post('http://127.0.0.1:3000/')
      .send([{ idIstex: '1234567890123456789012345678901234567890', corpusName: 'anything' }])
      .end(function(err, res) {
        expect(err).to.be.not.null;
        done();
      });
    });

    it('checks the syntax of idIstex', function(done) {
      request
      .post('http://127.0.0.1:3000/')
      .send([{ idIstex: '1234567890', corpusName: 'elsevier'}])
      .end(function(err, res) {
        expect(err).to.be.not.null;
        done();
      });
    });

  });

});
