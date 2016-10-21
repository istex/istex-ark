/**
 * Split ARK identifier in several parts into a nice JSON
 * idea come from: 
 * https://github.com/Inist-CNRS/ezark/blob/master/models/ark.js#L16-L22
 */
module.exports = function (ark) {
  if (!ark) return ark;

  var arkSplitted = ark.split('/'); 
  return {
    value:      ark,
    naan:       arkSplitted[1],
    name:       arkSplitted[2],
    subpub:     arkSplitted[2].substring(0, 3),
    identifier: arkSplitted[2].substring(4)
  }
}