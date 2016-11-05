/**
 * Split ARK identifier in several parts into a nice JSON
 * idea come from: 
 * https://github.com/Inist-CNRS/ezark/blob/master/models/ark.js#L16-L22
 */
var InistArk = require('inist-ark');
var ark      = new InistArk();

module.exports = function (arkValue) {
  if (!arkValue) return arkValue;
  return ark.parse(arkValue);
}