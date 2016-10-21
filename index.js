/*eslint global-require:"warn"*/
'use strict';

//var cfg   = require('./lib/config.js');
var pkg   = require('./package.json');
var kuler = require('kuler');

var express = require('express');
var app    = express();

// ark:/67375/ABC-123456
app.use('/ark:/*', require('./routes/ark.js'));

// 128CB89965DA8E531EC59C61102B0678DDEE6BB7
app.use('/[A-Z0-9]{40}', require('./routes/istexid.js'));

app.listen(3000, function () {
  console.info(kuler(pkg.name + ' ' + pkg.version + ' is listening', 'olive'));
  console.info(kuler('http://127.0.0.1:3000', 'green'));
});
