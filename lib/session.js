/**
 * Created by lanhao on 15/5/18.
 */
"use strict";

const tool = require('./tools');
const fs = require('fs');
const colors = require('colors');
const constant = require('./constant');

class Session {
  constructor(config, app) {
    this.app = app;
    this.config = config;
    this.storage = this.enableStorage(
      fs.existsSync(__dirname + '/' + config.session_driver + 'Store.js') ?
        require('./' + config.session_driver + 'Store') :
        {}
    );
  }

  enableStorage(storage) {
    if (typeof storage.set === 'function' && typeof storage.get === 'function') {
      return storage;
    } else {
      console.log('\nStorage must implements get/set method \n'.red);
      process.exit(-1);
    }
  }

  start(req, res) {
    let sid = req.cookie['xiaolan'] || this.genID(req);
    let storage = this.storage;
    req.session = storage.get(sid);
    if (!req.session) {
      req.session = {};
      res.res.setHeader("Set-Cookie", ["xiaolan=" + sid + ';path=/;HttpOnly']);
    }

    this.app.event.once(constant.EVENTS.RES_END, function () {
      storage.set(sid, req.session);
    });
  }

  genID(req) {
    return tool.md5(JSON.stringify(req.headers) + (new Date().getTime()))
  }
}
/*
 SessionCtrl.config = {};


 //初始化session到req
 SessionCtrl.start = (req, res) => {


 let sid = req.cookie['xiaolan'];
 if (!sid) sid = SessionCtrl.sid(JSON.stringify(req.headers) + (new Date().getTime()));

 if (!SessionCtrl.pool[sid]) {
 SessionCtrl.pool[sid] = {};
 res.setHeader("Set-Cookie", ["xiaolan=" + sid + ';path=/;HttpOnly']);
 }
 SessionCtrl.pool[sid]['sessionId'] = sid;
 req.session = SessionCtrl.pool[sid];
 }


 //将字符串cookie转换成对象

 SessionCtrl.cookieParser = (cookie) => {
 let _arr = cookie.split(';');
 let result = {};
 for (let k in _arr) {
 result[_arr[k].split('=')[0].replace(' ', '')] = _arr[k].split('=')[1];
 }
 return result;
 }

 //全局session池，在内存中存储
 SessionCtrl.pool = {};

 */
module.exports = Session;

