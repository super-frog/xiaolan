/**
 * Created by lanhao on 2017/8/28.
 */

'use strict';

const EOL = require('os').EOL;
const fs = require('fs');
const path = require('path');
const E = require('./error');

class Context {
  constructor(handleFunc, options = []) {
    this.handler = handleFunc;
    this.argsName = getArgsFromSource(this.handler);
    this.args = [];
    this.options = options;
    this.error = null;
  }

  reflect(req, res) {
    this.error = null;
    this.args = [];
    this.req = req;
    this.res = res;
    let args = this.argsName;
    let modelPath = this.options['modelPath'] || process.cwd() + '/definitions/'+this.options['name'];
    for (let k in args) {
      if (args[k].replace(/\s/g, '') === 'req') {
        this.args.push(req);
        continue;
      }
      else if (args[k].replace(/\s/g, '') === 'res') {
        this.args.push(res);
        continue;
      } else {
        let model = path.resolve(modelPath + '' + '/' + args[k].replace(/\s/g, ''));
        if (fs.existsSync(model + '.gen.js')) {
          let modelClass = require(model+'.gen');
          try {
            this.args.push(modelClass.fromRequest(this.req));
          }catch (e){
            let err = Object.assign(new E.XiaolanError({}), error.BAD_REQUEST);
            this.error = Object.assign(err, {message: error.BAD_REQUEST.message+':'+e.message});
          }
        } else {
          this.args.push(null);
        }
      }
    }
    return this;
  }

  async execute() {
    if(this.error){
      return Promise.resolve(this.error);
    }
    return await this.handler(...this.args);
  }
}

function getArgsFromSource(func) {
  let str = func.toString();
  let patten = /\((.*)\)/;
  let match = str.split(EOL)[0].match(patten);
  if (match) {
    return match[1].split(',');
  } else {
    return [];
  }
}

module.exports = Context;


