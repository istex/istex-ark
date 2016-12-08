var lmdb = require('node-lmdb');

var env = new lmdb.Env();
env.open({
    path: __dirname + "/mydata",
    mapSize: 2*1024*1024*1024, // maximum database size
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

var stream = fs.createReadStream('sample.jsonstream')
stream
  .pipe(JSONStream.parse())
  .pipe(es.mapSync(function (data) {
    if (data.doi.length == 0) return;
    
    // commit each 1M lines
    // (do not commit lines one bye one cause it takes a lot of time)
    if (nbLineToWrite == 10000) {
      txn.commit();
      console.log('commit 10000');
      nbLineToWrite = 0;
    }
    if (nbLineToWrite == 0) {
      txn = env.beginTxn();
    }

    txn.putString(dbi, data.doi[0], data.istexId);
    nbLineToWrite++;
  }));

stream.on('end', function () {
  txt.commit();
  dbi.close();
  env.close();
});
