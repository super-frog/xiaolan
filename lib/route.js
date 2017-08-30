'use strict';

const fs = require('fs');
const colors = require('colors');
const Context = require('./Context');

let route = {};

route.routingTable = {};

route.register = function (map) {
  for (let k in map) {
    let [method, patten] = k.split(' ');
    patten = patten.replace(/\*/, '.*');
    let reaction = map[k].split('.');
    let controllerPath = process.cwd() + '/controllers/';
    if (fs.existsSync(controllerPath + reaction[0] + '.js')) {
      let reactCtrl = require(controllerPath + reaction[0] + '.js');
      if (!route.routingTable[method]) {
        route.routingTable[method] = {};
      }

      let functionNotExists = (req, res) => {
        res.raw(501, {
          'content-type':'application/json'
        }, {
          code: 501,
          data: null,
          message: 'HTTP_NOT_IMPLEMENTED'
        });
      };

      route.routingTable[method][patten] = {
        'reg': new RegExp(toRegExp(patten), 'i'),
        'patten': patten,
        'reactor': reactCtrl[reaction[1]]? new Context(reactCtrl[reaction[1]]) : functionNotExists,
        'reactorName': map[k]
      };
    } else {
      console.log('Routing Error:No Ctrl', patten, map[k]);
      process.exit(-1);
    }
  }
  console.log(' ');
  console.log('Route Tables:'.green);
  for (let method in route.routingTable) {
    for (let k in route.routingTable[method]) {
      console.log(
        `${method}\t\t${route.routingTable[method][k]['patten']}\t\t${route.routingTable[method][k]['reactorName']}`
      );
    }
  }
  console.log(' ');
};

route.get = function (patten, reactions) {
  reactions = ('' + reactions).split('.');
  if (reactions[1] === undefined) {
    reactions[1] = 'index';
  }
  route.routingTable[patten] = {
    'ereg': '',
    'reaction': require(Xiaolan.basePath + '/controllers/' + reactions[0])[reactions[1]]
  };
};

const toRegExp = function (route) {
  let r = route.replace(/{\*}/ig, '[\/a-zA-Z0-9]*');
  r = r.replace(/{.+}/ig, '[\/a-zA-Z0-9]+');
  return '^' + r.replace(/\//ig, '\\/') + '[\/]?$';
};

module.exports = route;
