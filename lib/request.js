/**
 * Created by lanhao on 15/5/17.
 */

var Parser = require('./parser');
var Request = {};

Request.ext = function (req) {
    req.body = Parser.bodyParser(req.body,req.headers['content-type']);
    req.params = Parser.paramParser(req.url.split('?')[0]);
    req.query = Parser.queryParser(req.url.split('?')[1]);
};



module.exports = Request.ext;