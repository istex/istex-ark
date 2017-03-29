/*eslint global-require:"warn"*/
'use strict';

//var cfg   = require('./lib/config.js');
var pkg   = require('./package.json');
var kuler = require('kuler');

var express = require('express');
var cors    = require('cors');
var bodyParser = require('body-parser');
var app     = express();

// for parsing application/json
app.use(bodyParser.json());

// enable CORS for AJAX request from istex-view
app.use(cors());

// for the homepage
app.use(express.static('public'));

// ex: http://ark.istex.fr/ark:/12345/X04-T6BH06R1-H
app.use('/ark:/*', require('./routes/get-ark.js'));

// ex: http://ark.istex.fr/2A63B61B9B81319427DCABF1C7FC660ADD980D67
app.use('/[A-Z0-9]{40}', require('./routes/get-istexid.js'));

// post routes management
require('./routes/post-istexids.js').routing(app);

// GET /dump
// few arks and istex ID from the database
require('./routes/get-dump.js').routing(app);

app.listen(3000, function () {
  console.info(kuler(pkg.name + ' ' + pkg.version + ' is listening', 'olive'));
  console.info(kuler('http://127.0.0.1:3000', 'green'));
  console.info(kuler('http://127.0.0.1:45446 (production port)', 'green'));
});

/**
 * To handled CTRL+C events
 */
function shutdown() {
  console.log('\nGot a stop signal, shutting down...');
  process.exit(1);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
