/**
 * Created by lanhao on 15/5/18.
 */
'use strict';

const fs = require('fs');
const colors = require('colors');
const crypto = require('crypto');

class Session {
  constructor(config, app) {
    this.app = app;
    this.config = config;

    if (['memory'].includes(config.session_driver)) {
      this.storage = this.enableStorage(require('./' + config.session_driver + 'Store'));
    }
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
    req.session = storage.get(sid, res);
  }

  genID(req) {
    return md5(JSON.stringify(req.headers) + (new Date().getTime()));
  }
}

const md5 = (data) => {
  let Buffer = require('buffer').Buffer;
  let buf = new Buffer(data);
  let str = buf.toString('binary');
  let md5sum = crypto.createHash('md5');
  md5sum.update(str);
  data = md5sum.digest('hex');
  return data;
};

module.exports = Session;

