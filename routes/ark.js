/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('istex-ark:' + basename)
  , arkSplitter = require('../lib/ark-splitter.js')
  , mapping = require('../dump/istexid-ark.json');

module.exports = function (req, res, next) {
  var arkSplitted = arkSplitter(req.originalUrl.slice(1));

  debug('Requesting istexId mapped to this ARK: ' + arkSplitted);
  var istexId = mapping[arkSplitted.ark];
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
}