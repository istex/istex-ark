/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('istex-ark:' + basename);

module.exports = function (req, res, next) {
  var ark = req.originalUrl.slice(1);
  debug('Requesting istexId mapped to this ARK: ' + ark);
  return res.status(200).send(ark);
}