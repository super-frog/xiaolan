'use strict';

const fs = require('fs');

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
      if (reactCtrl[reaction[1]]) {
        if (!route.routingTable[method]) {
          route.routingTable[method] = {};
        }
        route.routingTable[method][patten] = {
          'reg': new RegExp(toRegExp(patten), 'i'),
          'reactor': reactCtrl[reaction[1]]
        };
      } else {
        console.log('Routing Error:No Function', patten, map[k]);
        process.exit(-1);
      }
    } else {
      console.log('Routing Error:No Ctrl', patten, map[k]);
      process.exit(-1);
    }
  }
  console.log(route.routingTable);
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
