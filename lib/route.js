
'use strict';

const fs = require('fs');
const colors = require('colors');
const Context = require('./Context');
const rightPad = require('right-pad');
const { EOL } = require('os');
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

      route.routingTable[method] = route.routingTable[method] || [];
      let functionNotExists = (req, res) => {
        res.raw(501, {
          'content-type': 'application/json'
        }, {
            code: 501,
            data: null,
            message: 'HTTP_NOT_IMPLEMENTED'
          });
      };
      route.routingTable[method].push({
        'reg': new RegExp(toRegExp(patten), 'i'),
        'patten': patten,
        'reactor': reactCtrl ? new Context(reactCtrl, { name: reaction }) : functionNotExists,
        'middleware': midFunc,
        'reactorName': map[k]
      });
      if (fs.existsSync(`${process.cwd()}/definitions/handlers/${reaction}/Enum.js`)) {
        let enumPatten = `${patten}/${reaction}_enum`;
        route.routingTable['get'] = route.routingTable['get'] || [];
        route.routingTable['get'].unshift({
          'reg': new RegExp(toRegExp(enumPatten), 'i'),
          'patten': enumPatten,
          'reactor': new Context(enumSet(reaction)),
          'middleware': [],
          'reactorName': map[k] + '_enum'
        });
      }
    } else {
      console.log('Routing Error:No Ctrl', patten, map[k]);
      process.exit(-1);
    }
  }
  route.routingTable['get'] = route.routingTable['get'] || [];
  route.routingTable['get'].unshift({
    reg: new RegExp(toRegExp(`${R.prefix}/_jsoc`), 'i'),
    patten: `${R.prefix}/_jsoc`,
    reactor: new Context(async function () {
      return require(process.cwd() + '/jsoc.json') || {};
    }, { name: 'jsoc' }),
    middleware: [],
    reactorName: 'jsoc'
  });

  console.log(' ');
  console.log('Route Tables:');
  console.log(
    `${EOL}${rightPad('Method', 8, ' ')}${rightPad('Path', 48, ' ')}${rightPad('Middleware', 16, ' ')}${'Handler' || ''}${EOL}`
  );
  colors.get = colors.green;
  colors.post = colors.blue;
  colors.put = colors.yellow;
  colors.mid = colors.gray;
  for (let method in route.routingTable) {
    for (let k in route.routingTable[method]) {
      let middleware = '';
      if (route.routingTable[method][k]['reactorName'].middleware) {
        middleware = route.routingTable[method][k]['reactorName'].middleware.join(',');
      }
      middleware += ' ';
      console.log(
        `${colors[method](rightPad(method, 8, ' '))}${rightPad(route.routingTable[method][k]['patten']||' ', 48, ' ')}${colors.mid(rightPad(middleware, 16, ' '))}${route.routingTable[method][k]['reactorName'].handler || ''}`
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
