/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('istex-ark:' + basename)
  , arkSplitter = require('../lib/ark-splitter.js')
  , mapping = require('../mapping-dump.json');

module.exports = function (req, res, next) {
  var ark = arkSplitter(req.originalUrl.slice(1));

  debug('Requesting istexId mapped to this ARK: ' + ark);
  var istexId = mapping[ark.value];
  if (istexId) {
    debug('istexId found: ' + ark.value + ' -> ' + istexId);
    return res.status(200).send({
      "ark": ark,
      "istexId": istexId
    });
  } else {
    debug('istexId not found: ' + ark.value);
    return res.status(404).send({ '_error': ark.value + ' do not have any corresponding istexId' });
  }
}