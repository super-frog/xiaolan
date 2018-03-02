'use strict';

const fs = require('fs');
const colors = require('colors');
const Context = require('./Context');

let route = {};

route.routingTable = {};

route.register = (R) => {

  let map = R.map();
  for (let k in map) {
    let [method, patten] = k.split(' ');
    patten = patten.replace(/\*/, '.*');
    let reaction = map[k].handler;
    let middleware = map[k].middleware;
    let midFunc = [];
    let controllerPath = process.cwd() + '/handlers/';

    for (let k in middleware) {
      if (fs.existsSync(controllerPath + middleware[k] + '.js')) {
        midFunc.push(new Context(require(controllerPath + middleware[k] + '.js'), { name: middleware[k] }));
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
        'reactor': reactCtrl ? new Context(reactCtrl, { name: reaction }) : functionNotExists,
        'middleware': midFunc,
        'reactorName': map[k]
      };
      if (fs.existsSync(`${process.cwd()}/definitions/handlers/${reaction}/Enum.js`)) {
        let enumPatten = `${patten}/${reaction}_enum`;
        route.routingTable['get'] = route.routingTable['get'] || {};
        route.routingTable['get'][enumPatten] = {
          'reg': new RegExp(toRegExp(enumPatten), 'i'),
          'patten': enumPatten,
          'reactor': new Context(enumSet(reaction)),
          'middleware': [],
          'reactorName': map[k] + '_enum'
        };
      }
    } else {
      console.log('Routing Error:No Ctrl', patten, map[k]);
      process.exit(-1);
    }
  }
  route.routingTable['get'] = route.routingTable['get'] || {};
  route.routingTable['get']['/_jsoc'] = {
    reg: new RegExp(toRegExp(`${R.prefix}/_jsoc`), 'i'),
    patten: `${R.prefix}/_jsoc`,
    reactor: new Context(async function () {
      return require(process.cwd() + '/jsoc.json') || {};
    }, { name: 'jsoc' }),
    middleware: [],
    reactorName: 'jsoc'
  };

  console.log(' ');
  console.log('Route Tables:'.green);
  // console.log(`[system]`.yellow);
  // console.log(`*get\t\t/_jsoc${' '.repeat(32-'/_jsoc'.length)}(response jsoc.json)`.gray);
  // console.log(`\n[customer]`.yellow);
  for (let method in route.routingTable) {
    for (let k in route.routingTable[method]) {
      console.log(
        `${method}\t\t${route.routingTable[method][k]['patten']}${' '.repeat(36 - (route.routingTable[method][k]['patten'].length<36?route.routingTable[method][k]['patten'].length:30))}${route.routingTable[method][k]['reactorName'].handler || ''}`
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

const enumSet = (reaction) => {
  return async () => {
    return require(`${process.cwd()}/definitions/handlers/${reaction}/Enum.js`);
  };
};

module.exports = route;
//console.log(new RegExp(toRegExp('/user/{id}/book/{bid}')));