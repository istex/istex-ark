/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';


var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('istex-ark:' + basename)
  , InistArk = require('inist-ark')
  , async = require('async')
  , redisClient = require('redis').createClient({'host': 'istex-ark-redis'})
  , subpublishers = require('../dump/istexcorpus-arksubpublisher.json')
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
      const ark = new InistArk();

      const arks = {}
      const docObjects = req.body;

      async.eachSeries(docObjects, function(docObject, next) {
        const corpusName = docObject.corpusName;
        const idIstex = docObject.idIstex;
        const subpublisher = subpublishers[corpusName];

        // check that the subpublisher exists in the list
        if (!subpublisher) {
          debug('Misssing subpublisher', docObject);
          return next(new Error('Missing corpusName'));
        }

        // check that the istexid is syntaxycaly ok
        if (!/^[A-Z0-9]{40}$/.test(idIstex)) {
          debug('Ignoring item because istexid syntax is wrong ^[A-Z0-9]{40}$', docObject);
          return next(new Error('idIstex should match ^[A-Z0-9]{40}$'));
        }

        async.waterfall([
          // check that the idIstex has not yet an ARK
          function checkIdIstex(cbs1) {
            redisClient.get(idIstex, function(err, existingArk) {
              if (err) { return cbs1(err); }
              debug('existingArk', existingArk);
              arks[idIstex] = existingArk;
              return cbs1(null, existingArk);
            })
          },
          function checkArk(theArk, cbs2) {
            debug('theArk', theArk);
            if (theArk) { return cbs2(); }
            // check that the ARK does not yet exist
            async.during(function testArkUnicity(cb1) {
              if (theArk === null) {
                return cb1(null, true);
              }
              redisClient.exists(theArk, cb1);
            },
            function generateNewArk(cb2) {
              theArk = ark.generate({subpublisher: subpublisher});
              debug('newArk', theArk, 'idIstex', idIstex);
              return cb2(null)
            },
            function cb(err) {
              if (err) { return cbs2(err); }
              arks[idIstex] = theArk;
              async.parallel([
                function setArk (cbp1) {
                  redisClient.set(theArk, idIstex, cbp1);
                },
                function setIdIstex(cbp2) {
                  redisClient.set(idIstex, theArk, cbp2);
                }
              ],
              cbs2)
            })
          }
        ], function (err) {
          debug('waterfall end', arks);
          next(err)
        });
      }, function (err) {
        if (err) {
          return res.status(400).send(err);
        }
        res.status(201).send(arks);
      });

    }

  });

};