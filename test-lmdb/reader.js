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

var stream = fs.createReadStream('sample.jsonstream')
stream
  .pipe(JSONStream.parse())
  .pipe(es.mapSync(function (data) {
    console.log('HANDLE ' + JSON.stringify(data));
    if (data.doi.length == 0) return;

    var txn = env.beginTxn();
    console.log('READ ' + data.doi[0] + ' => ' + txn.getString(dbi, data.doi[0]));
    txn.commit();
  }));

stream.on('end', function () {
  dbi.close();
  env.close();
});
