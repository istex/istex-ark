/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';


var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('istex-ark:' + basename)
  , InistArk = require('inist-ark')
  , async = require('async')
  , redisClient = require('redis').createClient({'host': 'istex-ark-redis'})
  ;

module.exports.routing = function (app) {

  // ex: GET http://ark.istex.fr/
  app.get('/dump',function (req, res) {

    // loop over all the ark/istexid
    redisClient.keys('ark*', function (err, arks) {
      async.map(arks, function (ark, cb) {
        redisClient.get(ark, function (err, istexId) {
          cb(null, {
            istexId: istexId,
            ark:     ark
          });
        })
      }, function (err, results) {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
      });
    });

  });

};