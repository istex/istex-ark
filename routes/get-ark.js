/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('istex-ark:' + basename)
  , redisClient = require('redis').createClient({'host': 'istex-ark-redis'})
  , InistArk = require('inist-ark');

var ark = new InistArk(
  { naan: process.env.NODE_ENV === 'production' ? '67375' : '12345' }
);

module.exports = function (req, res, next) {
  var arkSplitted  = ark.parse(req.originalUrl.slice(1));
  var arkValidated = ark.validate(req.originalUrl.slice(1));
  if (!arkValidated.ark) {
    return res.status(400).send({
      '_error': arkSplitted.ark + ' is not valide',
      'arkValidated': arkValidated
    });
  }

  debug('Requesting istexId mapped to this ARK: ' + arkSplitted);

  redisClient.get(arkSplitted.ark, function (err, istexId) {
    if (istexId) {
      debug('istexId found: ' + arkSplitted.ark + ' -> ' + istexId);
      return res.status(200).send({
        "ark": arkSplitted,
        "istexId": istexId
      });
    } else {
      debug('istexId not found: ' + arkSplitted.ark);
      return res.status(404).send({ '_error': arkSplitted.ark + ' do not have any corresponding istexId' });
    }
  });

}