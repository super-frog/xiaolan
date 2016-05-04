/**
 * Created by lanhao on 16/4/29.
 */
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200);
    res.end('hello world!');
}).listen(1334);