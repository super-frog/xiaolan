"use strict";

/**
 * Created by lanhao on 15/5/17.
 */
var swig = require('swig');
var fs = require('fs');
var Response = {};

//后退一步
Response.rollback = (res) => {
  return (msg) => {
    res.setHeader('content-type', 'text/html; charset=UTF-8');
    let script = '<h1>代码出错了:' + msg + '</h1><script>setTimeout(function(){history.back();},2000);</script>';
    res.end(script);
  };
};

//格式化返回一个json数据结构
Response.json = (res) => {
  return (code, data, message) => {
    res.setHeader('content-type', 'application/json; charset=UTF-8');
    res.end(JSON.stringify({
      'code': code,
      'data': data,
      'message': message
    }));
  };
};


//使用swig渲染一个html模板
Response.render = (res) => {
  return (file, obj) => {
    res.end(swig.renderFile(process.cwd() + '/views/html/' + file, obj));
  };
};

//直接发送一个静态文件
Response.sendFile = (res) => {
  return (file) => {
    var mime = require('./mime');
    var ext = file.split('.').pop();
    var filename = process.cwd() + '/views/html/' + file;
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
Response.redirect = (res) => {
  return (url) => {
    res.writeHead(302, {
      'Location': url
    });
    res.end();
  };
};

//raw
Response.raw = (res) => {
  return (code, header, body) => {
    res.writeHeader(code, header);
    res.end(JSON.stringify(body));
  };
};

//将函数扩展到res对象
Response.init = (res) => {
  res.redirect = Response.redirect(res);
  res.json = Response.json(res);
  res.render = Response.render(res);
  res.html = Response.sendFile(res);
  res.rollback = Response.rollback(res);
  res.raw = Response.raw(res);
  //common headers
  res.setHeader('used_time', (new Date()).getTime() - res.start.getTime());
  res.setHeader("X-Powered-By", 'xiaolan');
  if (global.app.config.cors == true) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  }
};


module.exports = Response.init;