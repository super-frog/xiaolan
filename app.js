/**
 * Created by lanhao on 15/5/17.
 */
"use strict";

const http = require('http');
const fs = require('fs');
const Events = require('events');
const serveStatic = require('serve-static');

const Route = require('./lib/route');
const Request = require('./lib/request');
const Response = require('./lib/response');
const Session = require('./lib/session');
const E = require('./lib/error');

if(fs.existsSync(process.cwd()+'/errors/Error.gen.js')){
  let errDefine = require(process.cwd()+'/errors/Error.gen.js');
  for(let k in errDefine){
    E.RegisterError(errDefine[k]);
  }
  global.error = E.ErrorShop;
}else{
  global.error = {
    UNKNOWN_ERROR:new E.XiaolanError({
      code:-1,
      httpStatus:500,
      message:'unknown',
      name:'UNKNOWN_ERROR',
    })
  }
};


class Xiaolan {
  constructor(config) {
    this.basePath = process.cwd();
    this.config = config;
    this.sessionStorage = new Session(config, this);
    this.route = this.register();
    this.event = new Events();
    process.app = this;
  }

  register() {
    let map = {};
    if (fs.existsSync(process.cwd() + '/routes.js')) {
      map = require(process.cwd() + '/routes');
    }

    Route.register(map);
    return Route.routingTable;
  }

  createServer() {
    let app = this;
    let serve = serveStatic(process.cwd() + '/views/');
    http.createServer((req, res) => {
      let _date = new Date();

      console.log(' ');
      console.log(_date.toLocaleString());
      console.log(req.method, req.url);

      if (this.config.cors === true) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
      }


      if (this.config.static.has((req.url.split('?').shift()).split('.').pop())) {
        //静态文件
        serve(req, res, (err) => {
          if (err) {
            console.log('Static Error:'+err.toString());
          }
          res.end('404 NOT FOUND');
        });
      } else {

        req.body = '';
        req.on('data', (chunk) => {
          req.body += chunk;
        });
        req.on('end', () => {
          let response = new Response(res, app);
          let request = new Request(req, app);
          app.sessionStorage.start(request, response);
          app.handler(request, response);
        });
      }

    }).listen(this.config.port || 3001);

    console.log('listen on port:' + (this.config.port || 3001));
    console.log('.');
    console.log('.   <------ nobody care about this point!!');
  }

  handler(req, res) {

    if (Object.keys(this.route).length > 0) {
      let method = req.method.toLocaleLowerCase();
      let uri = req.pathInfo;
      let matched = false;
      if (this.route[method]) {
        for (var k in this.route[method]) {
          if (this.route[method][k].reg.test(uri)) {
            matched = true;
            break;
          }
        }
        if (matched) {
          for(let i in this.route[method][k].middleware){
            let r = this.route[method][k].middleware[i].reflect(req,res).execute();
            if(r instanceof E.XiaolanError){
              res.json(r.httpStatus, r.obj());
              return ;
            }
          }
          let r = this.route[method][k].reactor.reflect(req,res).execute();
          if(r instanceof E.XiaolanError){
            res.json(r.httpStatus, r.obj());
          }else{
            res.json(200,r);
          }
          return;
        } else {
          res.notFound('404 not found');
        }
      } else {
        res.notFound('404 not found');
      }
    } else {

      try {
        require(this.basePath + '/controllers/' + req.params[0])[req.params[1]](req, res);
      } catch (ex) {
        console.log(ex);
        res.notFound('404 not found');
      }
    }
  }
}



module.exports = Xiaolan;
