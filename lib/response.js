"use strict";

/**
 * Created by lanhao on 15/5/17.
 */
var swig = require('swig');
var fs = require('fs');
var Response = {};

//后退一步
Response.rollback = function(res){
    return function(msg){
        res.setHeader('content-type','text/html; charset=UTF-8');
        let script = '<h1>代码出错了:'+msg+'</h1><script>setTimeout(function(){history.back(-1);},2000);</script>';
        res.end(script);
    };
}

//格式化返回一个json数据结构
Response.json = function (res) {
    return function(code,data,message){
        res.setHeader('content-type','application/json; charset=UTF-8');
        res.end(JSON.stringify({
            'code':code,
            'data':data,
            'message':message
        }));
    };
};

//使用swig渲染一个html模板
Response.render = function (res) {
    return function (file,obj) {
        res.end(swig.renderFile(process.cwd()+'/views/html/'+file, obj));
    }
};

//直接发送一个静态文件
Response.sendFile = function (res) {
    return function (file) {
        var mime = require('./mime');
        var ext = file.split('.').pop();
        var filename = process.cwd()+'/views/html/'+file;
        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('500');
            } else {
                res.writeHead(200, {
                    'Content-Type': mime[ext]
                });
                res.write(file, "binary");
                res.end();
            }
        });
    };
};
//redirect
Response.redirect = function redirect(res) {
    return function (url) {
        res.writeHead(302, {
            'Location':url
        });
        res.end();
    }
};
//将函数扩展到res对象
Response.init = function (res) {
    res.redirect = Response.redirect(res);
    res.json = Response.json(res);
    res.render = Response.render(res);
    res.html = Response.sendFile(res);
    res.rollback = Response.rollback(res);
    if(global.app.config.cors){
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.setHeader("X-Powered-By",' 3.2.1');
    }
}

module.exports = Response.init;