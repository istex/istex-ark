console.log('HELLO writer.js');

var memwatch = require('memwatch-next');
memwatch.on('leak', function (info) {
  console.log('MEMORY LEAK', info);
});

memwatch.on('stats', function (stats) {
  console.log('MEMORY STATS: ', JSON.stringify(stats));
});

var lmdb = require('node-lmdb');

var env = new lmdb.Env();
env.open({
    path: __dirname + "/mydata",
    mapSize: 8*1024*1024*1024, // maximum database size
    maxDbs: 3
});

var dbi = env.openDbi({
    name: "myPrettyDatabase",
    create: true // will create if database did not exist
})



var fs = require('fs');
var JSONStream = require('JSONStream');
var es = require('event-stream'); 


var nbLineToWrite = 0;
var txn;
var totalWrite = 0;

var stream = fs.createReadStream('sample.jsonstream')
stream
  .pipe(JSONStream.parse())
  .pipe(es.mapSync(function (data) {
    if (data.doi.length == 0) return;
    // commit each 1M lines
    // (do not commit lines one bye one cause it takes a lot of time)
    if (nbLineToWrite == 10000) {
      txn.commit();
      memwatch.gc();
      console.log('commit +10000 (total=' + totalWrite + ')');
      nbLineToWrite = 0;
    }
    if (nbLineToWrite == 0) {
      txn = env.beginTxn();
    }

    txn.putString(dbi, data.doi[0], data.istexId);
    nbLineToWrite++;
    totalWrite++;
  }));

stream.on('end', function () {
  txn.commit();
  dbi.close();
  env.close();
  console.log("total nb of written entries: " + totalWrite);
});
