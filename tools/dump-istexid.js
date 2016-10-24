//var request = require('request');
var request = require('requestretry');

//var urls = [ 'https://api.istex.fr/document/?q=*&output=id,corpusName&size=1000' ]
var urls = [ 'https://api.istex.fr/document/?q=*&size=1000&output=id,corpusName&defaultOperator=OR&from=8229000' ]

function getIstexIdsFromOnePage() {
  var url = urls.pop();
  request.get({
    url: url,
    maxAttempts: 50,   // (default) try 5 times
    retryDelay: 5000,  // (default) wait for 5s before trying again
    retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
  }, function (err, res) {
    if (err) {
      console.error(err, url);
      return;
    }
    var json = JSON.parse(res.body);
    if (json && json.hits) {
      json.hits.forEach(function (doc) {
        console.log(doc.corpusName, doc.id);
      });
    } else {
      console.error('json.hits empty ' + url);
      console.error(json);
    }
    if (json.nextPageURI) {
      urls.push(json.nextPageURI);
    } else {
      console.error('no more nextPageURL ' + url)
    }
    setTimeout(function () {
      getIstexIdsFromOnePage();
    }, 10);
  });
}
setTimeout(function () {
  getIstexIdsFromOnePage();
}, 10);
