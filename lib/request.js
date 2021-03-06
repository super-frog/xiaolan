/**
 * Created by lanhao on 15/5/17.
 */
'use strict';

const Parser = require('./parser');

class Request {
  constructor(req) {
    this.body = Parser.bodyParser(req.body, req.headers['content-type']);
    this.pathInfo = req.url.split('?')[0];
    this.rawParams = Parser.paramParser(req.url.split('?')[0]);
    this.query = Parser.queryParser(req.url.split('?')[1]);
    this.headers = req.headers;
    this.cookie = Parser.cookieParser(req.headers.cookie || '');
    this.method = req.method;
  }

  pickParams(routePath) {
    this.params = Parser.paramPicker(routePath, this.rawParams);
  }
}


module.exports = Request;