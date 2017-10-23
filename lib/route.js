'use strict';

const fs = require('fs');
const colors = require('colors');
const Context = require('./Context');

let route = {};

route.routingTable = {};

route.register = (map) => {

  for (let k in map) {
    let [method, patten] = k.split(' ');
    patten = patten.replace(/\*/, '.*');
    let reaction = map[k].handler;
    let middleware = map[k].middleware;
    let midFunc = [];
    let controllerPath = process.cwd() + '/handlers/';

    for (let k in middleware) {
      if (fs.existsSync(controllerPath + middleware[k] + '.js')) {
        midFunc.push(new Context(require(controllerPath + middleware[k] + '.js')));
      }
    }

    if (fs.existsSync(controllerPath + reaction + '.js')) {
      let reactCtrl = require(controllerPath + reaction + '.js');
      if (!route.routingTable[method]) {
        route.routingTable[method] = {};
      }

      let functionNotExists = (req, res) => {
        res.raw(501, {
          'content-type': 'application/json'
        }, {
          code: 501,
          data: null,
          message: 'HTTP_NOT_IMPLEMENTED'
        });
      };
      route.routingTable[method][patten] = {
        'reg': new RegExp(toRegExp(patten), 'i'),
        'patten': patten,
        'reactor': reactCtrl ? new Context(reactCtrl, {name: reaction}) : functionNotExists,
        'middleware': midFunc,
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
        `${method}\t\t${route.routingTable[method][k]['patten']}\t\t${route.routingTable[method][k]['reactorName'].handler}`
      );
    }
  }
  console.log(' ');
};

route.get = (patten, reactions) => {
  reactions = ('' + reactions).split('.');
  if (reactions[1] === undefined) {
    reactions[1] = 'index';
  }
  route.routingTable[patten] = {
    'ereg': '',
    'reaction': require(Xiaolan.basePath + '/handlers/' + reactions[0])[reactions[1]]
  };
};

const toRegExp = (route) => {
  let r = route.replace(/{\w+?}/ig, '([^\/]+?)');
  return '^' + r.replace(/\//ig, '\\/') + '\/?$';
};

module.exports = route;
//console.log(new RegExp(toRegExp('/user/{id}/book/{bid}')));