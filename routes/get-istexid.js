/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('istex-ark:' + basename)
  , redisClient = require('redis').createClient({'host': 'istex-ark-redis'})
  , InistArk = require('inist-ark');

var inistArk = new InistArk(
  { naan: process.env.NODE_ENV === 'production' ? '67375' : '12345' }
);

module.exports = function (req, res, next) {
  var istexId = req.originalUrl.slice(1);

  debug('Requesting ARK mapped to this istexId: ' + istexId);

  redisClient.get(istexId, function (err, ark) {
    if (err) return res.status(500).send(err);
    
    var arkSplitted = (ark) ? inistArk.parse(ark) : null;
    if (arkSplitted) {
      debug('ARK found: ' + istexId + ' -> ' + arkSplitted.ark);
      return res.status(200).send({
        "ark": arkSplitted,
        "istexId": istexId
      });
    } else {
      debug('ARK not found: ' + istexId);
      return res.status(404).send({ '_error': istexId + ' do not have any corresponding ARK' });
    }
  });

};