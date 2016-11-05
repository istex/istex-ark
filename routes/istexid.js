/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('istex-ark:' + basename)
  , arkSplitter = require('../lib/ark-splitter.js')
  , mapping = require('../dump/istexid-ark.json');

module.exports = function (req, res, next) {
  var istexId = req.originalUrl.slice(1);

  debug('Requesting ARK mapped to this istexId: ' + istexId);
  var arkSplitted = arkSplitter(mapping[istexId]);
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