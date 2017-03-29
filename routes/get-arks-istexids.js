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
    res.status(200).send([
      { istexId: 'D05B81D27DEB061B4F7B26DD039414D528C85635',
        ark:     'ark:/12345/X04-G7SXMTWB-R' },
      { istexId: 'E1F158FC4D8E0861E2B43A6F4D044E14116EA11A',
        ark:     'ark:/12345/X01-RPWGDW7L-0' }
    ]);
  });

};