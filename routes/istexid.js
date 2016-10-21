/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('istex-ark:' + basename);

module.exports = function (req, res, next) {
  var istexId = req.originalUrl.slice(1);
  debug('Requesting ARK mapped to this istexId: ' + istexId);
  return res.status(200).send(istexId);
}