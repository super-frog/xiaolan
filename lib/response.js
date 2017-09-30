"use strict";

/**
 * Created by lanhao on 15/5/17.
 */

const fs = require('fs');
const mime = require('./mime');
const constant = require('./constant')

class Response {
  constructor(res, app) {
    res.setHeader("X-Powered-By", 'xiaolan');
    this.res = res;
    this.app = app;
  }

  end(content, headers = {}) {
    this.app.event.emit(constant.EVENTS.RES_END);
    for (let k in headers) {
      this.res.setHeader(k, headers[k]);
    }
    console.log('Time used:',(new Date()).getTime()-this.requestTime);
    this.res.end(content);
  }

  json(code = 200, data = {}, message = '') {

    this.end(JSON.stringify({
      'code': code,
      'data': data,
      'message': message
    }), {
      'content-type': 'application/json; charset=UTF-8'
    });
  }

  //todo: send file stream

  redirect(url) {
    this.res.writeHead(302, {
      'Location': url
    });
    this.end();
  }

  raw(code = 200, headers = {}, body = {}) {
    let res = this.res;
    res.writeHeader(code, headers);
    this.end(JSON.stringify(body));
  }

  notFound(message = '') {
    this.raw(404, {'content-type': 'application/json; charset=UTF-8'}, message);
  }
}


module.exports = Response;