/**
 * Created by lanhao on 15/5/18.
 */
"use strict";

const tool = require('./tools')();

let SessionCtrl = {};

SessionCtrl.config = {};

//生成唯一 SID
SessionCtrl.sid = (cookie) => {
    return tool.md5(cookie);
};

//组建初始化，加载配置文件
SessionCtrl.init = (config) => {

    SessionCtrl.config = config;

    return SessionCtrl;
}

//初始化session到req
SessionCtrl.start = (req,res) => {
    req.cookie = {};
    if(req.headers.cookie){
        req.cookie = SessionCtrl.cookieParser(req.headers.cookie);
    }

    let sid = req.cookie['xiaolan'];
    if(!sid)sid = SessionCtrl.sid(JSON.stringify(req.headers)+(new Date().getTime()));

    if(!SessionCtrl.pool[sid]){
        SessionCtrl.pool[sid] = {};
    }
    res.setHeader("Set-Cookie", ["xiaolan="+sid]);
    SessionCtrl.pool[sid]['sessionId'] = sid;
    req.session = SessionCtrl.pool[sid];
}


//将字符串cookie转换成对象

SessionCtrl.cookieParser = (cookie) => {
    let _arr = cookie.split(';');
    let result = {};
    for(let k in _arr){
        result[_arr[k].split('=')[0].replace(' ','')] = _arr[k].split('=')[1];
    }
    return result;
}

//全局session池，在内存中存储
SessionCtrl.pool = {};



module.exports = SessionCtrl.init;

