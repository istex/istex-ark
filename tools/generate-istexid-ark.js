//
// Script used to generate dump/istexid-ark.json 
// it is the mapping between istexId and ARK.
// 
// dump/istexcorpus-arksubpublisher.json is used to
// associate ISTEX corpusName to ARK subpublisher.
// 
// To update the dump/istexid-ark.json dump:
//   node tools/generate-istexid-ark.js > dump/istexid-ark-tmp.json
//   mv dump/istexid-ark-tmp.json dump/istexid-ark.json 
//
var async    = require('async');
var request  = require('request');
var InistArk = require('inist-ark');
var debug    = require('debug')('generate-istexid-ark');


var istexIdArkMapping   = require('../dump/istexid-ark.json');
var rawIstexId          = require('../dump/istexid.json');
var subpublisherMapping = require('../dump/istexcorpus-arksubpublisher.json');
var ark = new InistArk();
async.each(Object.keys(rawIstexId), function (istexId, cb) {
  
  // check it there an existing ARK for this istexID
  if (istexIdArkMapping[istexId]) {
    var arkValidated = ark.validate(istexIdArkMapping[istexId]);
    if (arkValidated.ark === true) {
      debug('Skiping ' + istexId + ' because a valid ARK already exists: ' + istexIdArkMapping[istexId]);    
      return cb();
    }
  }

  // generate a new ark but firstly get the corpusName to have the subpublisher
  debug('Requesting ISTEX API for istexId: ' + istexId);
  request.get({
    url: 'https://api.istex.fr/document/' + istexId + '/',
    json: true }, function (err, res) {
    debug('ISTEX API response for: ' + istexId);
    if (err) return cb(err);
    var doc = res.body;
    var newArk = ark.generate({ subpublisher: subpublisherMapping[doc.corpusName] });
    debug('  -> Corpus is: ' + doc.corpusName);
    debug('  -> Subpublisher is: ' + subpublisherMapping[doc.corpusName]);
    debug('  -> ARK is: ' + newArk);
    istexIdArkMapping[istexId] = newArk;
    istexIdArkMapping[newArk]  = istexId;
    cb();
  });
}, function (err) {
  if (err) throw err;

  // output the result to stdout
  process.stdout.write(JSON.stringify(istexIdArkMapping, null, ' '));
});