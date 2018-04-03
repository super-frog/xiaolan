/**
 * Created by lanhao on 15/5/17.
 */
'use strict';
const fs = require('fs');
const mime = require('./mime');

class Response {
  constructor(res) {
    res.setHeader("X-Powered-By", 'xiaolan');
    this.res = res;
  }

  end(content, headers = {}) {
    for (let k in headers) {
      this.res.setHeader(k, headers[k]);
    }

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
    this.raw(404, { 'content-type': 'application/json; charset=UTF-8' }, message);
  }
}


module.exports = Response;