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

  app.get('/dump',function (req, res) {

    // count how much ARK in the Redis database
    // divided by 2 because there is 2 kind of key
    // for the same ARK: idistex & ark
    redisClient.dbsize(function (err, count) {
      var nbARKs = count / 2;

      // loop over all the ark/istexid
      // limit to the 100 first ARKs
      // to get all the arks: redisClient.keys('ark*', function (err, arks) {
      redisClient.send_command('SCAN', [0, 'COUNT', 100, 'MATCH', 'ark*'], function (err, arks) {
        if (err) return res.status(500).send(err);
        async.map(arks[1], function (ark, cb) {
          redisClient.get(ark, function (err, istexId) {
            cb(null, {
              istexId: istexId,
              ark:     ark
            });
          })
        }, function (err, results) {
          if (err) return res.status(500).send(err);
          res.status(200).send({
            totalCount: nbARKs,
            items: results
          });
        });
      });

    });



  });

};