/**
 * Created by lanhao on 15/5/17.
 */


var http = require('http');

var Xiaolan = {};

Xiaolan.basePath = process.cwd();

Xiaolan.config = null;

Xiaolan.sayHello = function () {
    console.log('hello');
};

Xiaolan.init = function (config) {
    //应用全局化
    global.app = Xiaolan;

    Xiaolan.config = config;

    if(config.modules){
        Xiaolan.libs = {};
        for(var k in config.modules){
            if(config.modules[k].import){
                Xiaolan.libs[k] = require('./lib/'+k)(config.modules[k].config);
                console.log('Load ['+k+']  ok!');
            }
        }
    }
    return Xiaolan;
};

Xiaolan.createServer = function () {
    var Request = require('./lib/request');
    var Response = require('./lib/response');

    var serveStatic = require('serve-static');
    var serve = serveStatic(process.cwd()+'/views/');
    var config = global.app.config;
    var _port = config.port?config.port:3000;
    var _ip = config.ip?config.ip:null;
    http.createServer(function (req, res) {
        console.log(req.url);
        if(global.app.libs['session']){
            global.app.libs['session'].start(req,res);
        }
        Response(res);
        if(config.static.toString().indexOf((req.url.split('?').shift()).split('.').pop()) != -1){
            serve(req,res, function (err) {
                if(!err){
                    res.end('');
                }
            });
        }else {
            if(req.method=='GET'){
                Request(req);
                Xiaolan.handler(req,res);
            }else{
                req.body = '';
                req.on('data', function (chunk) {
                    req.body += chunk;
                });
                req.on('end', function () {
                    Request(req);
                    Xiaolan.handler(req,res);
                });
            }
        }
    }).listen(_port,_ip);
    console.log('listen on port:' + _port+',ip:'+_ip);
    console.log('.');
    console.log('.   <------ nobody care about this point!!');
};


Xiaolan.handler = function (req, res) {
    try {
        require(Xiaolan.basePath + '/controllers/' + req.params[0])[req.params[1]](req, res);
    } catch (ex) {
        console.log(ex);
        res.end('404 not found');
    }
}


module.exports = Xiaolan.init;
