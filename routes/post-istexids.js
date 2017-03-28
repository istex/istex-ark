/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';


var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('istex-ark:' + basename)
  , InistArk = require('inist-ark')
  , redisClient = require('redis').createClient({'host': 'istex-ark-redis'})
  ;

/**
 * Fonction de routage exportée.
 *
 * @method routing
 * @param {Object} app express
 * @return undefined undefined
 */
module.exports.routing = function (app) {
  
  // ex: http://ark.istex.fr/
  // Body of POST request [{corpusName:... , idIstex:... }, ....]
  app.post('/',function (req, res) {
    if (!req.body || Object.keys(req.body).length <= 0) {
      res.status(400).send('Sorry, you must give an array of {corpusName:..., idIstex:...} in the body of your POST request !')
    } else {
      res.send('Not yet implemented');
    }
  
  });
  
};