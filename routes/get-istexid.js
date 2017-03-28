/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('istex-ark:' + basename)
  , mapping = require('../dump/istexid-ark.json')
  , InistArk = require('inist-ark');

var ark = new InistArk({ naan: '12345' });

module.exports = function (req, res, next) {
  var istexId = req.originalUrl.slice(1);

  debug('Requesting ARK mapped to this istexId: ' + istexId);
  var arkSplitted = ark.parse(mapping[istexId]);
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
}