/**
 * Created by lanhao on 15/5/17.
 */
"use strict";


const http = require('http');
const EOL = require('os').EOL;
const fs = require('fs');

let Xiaolan = {};

Xiaolan.basePath = process.cwd();

Xiaolan.config = null;

Xiaolan.init = function (config) {
  //应用全局化
  global.app = Xiaolan;

  Xiaolan.config = config;

  if (config.modules) {
    Xiaolan.libs = {};
    for (let k in config.modules) {
      if (config.modules[k].import) {
        Xiaolan.libs[k] = require('./lib/' + k)(config.modules[k].config);
        console.log('Load [' + k + ']  ok!');
      }
    }
  }
  return Xiaolan;
};

Xiaolan.route = null;

Xiaolan.register = function (map) {
  let Route = require('./lib/route');
  Route.register(map);
  Xiaolan.route = Route.routingTable;
};

Xiaolan.createServer = function () {
  if(fs.existsSync(process.cwd() + '/routes.js')) {
    Xiaolan.register(require(process.cwd() + '/routes'));
  }else{
    Xiaolan.register({});
  }
  let Request = require('./lib/request');
  let Response = require('./lib/response');
  let serveStatic = require('serve-static');
  let serve = serveStatic(process.cwd() + '/views/');
  let config = global.app.config;
  let _port = config.port ? config.port : 3000;
  let _ip = config.ip ? config.ip : null;

  http.createServer(function (req, res) {
    let _date = req.start = res.start = new Date();
    console.log(_date.toLocaleString());
    console.log(req.url);
    console.log('====================');
    console.log(req.body || {});
    console.log('===================='+EOL);

    global.app.libs['session'].start(req, res);

    Response(res);
    if (config.static.toString().indexOf((req.url.split('?').shift()).split('.').pop()) != -1) {
      serve(req, res, function (err) {
        if (!err) {
          res.end('');
        }
      });
    } else {
      req.body = '';
      req.on('data', function (chunk) {
        req.body += chunk;
      });
      req.on('end', function () {
        Request(req);
        Xiaolan.handler(req, res);
      });
    }

  }).listen(_port, _ip);
  console.log('listen on port:' + _port + ',ip:' + _ip);
  console.log('.');
  console.log('.   <------ nobody care about this point!!');

};


Xiaolan.handler = function (req, res) {
  if (Object.keys(Xiaolan.route).length > 0) {
    let method = req.method.toLocaleLowerCase();
    let uri = req.pathInfo;
    let matched = false;
    if (Xiaolan.route[method]) {
      for (let k in Xiaolan.route[method]) {
        if (Xiaolan.route[method][k].reg.test(uri)) {
          matched = true;
          break;
        }
      }
      if (matched) {
        Xiaolan.route[method][k].reactor(req, res);
      } else {
        res.end('404 not found');
      }
    } else {
      res.end('404 not found');
    }
  } else {

    try {
      require(Xiaolan.basePath + '/controllers/' + req.params[0])[req.params[1]](req, res);
    } catch (ex) {
      console.log(ex);
      res.end('404 not found');
    }
  }
};


module.exports = Xiaolan.init;
