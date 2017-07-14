/**
 * Created by lanhao on 15/5/17.
 */
"use strict";

const Parser = require('./parser');
const Request = {};

Request.init = function (req) {
    req.body = Parser.bodyParser(req.body,req.headers['content-type']);
    req.pathInfo = req.url.split('?')[0];
    req.params = Parser.paramParser(req.url.split('?')[0]);
    req.query = Parser.queryParser(req.url.split('?')[1]);
};


module.exports = Request.init;