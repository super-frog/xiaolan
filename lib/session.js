/**
 * Created by lanhao on 15/5/18.
 */

var tool = require('./tools');

var SessionCtrl = {};

SessionCtrl.config = {};

//生成唯一 SID
SessionCtrl.sid = function (cookie) {
    return tool.md5(cookie);
};

//组建初始化，加载配置文件
SessionCtrl.init = function (config) {

    SessionCtrl.config = config;

    return SessionCtrl;
}

//初始化session到req
SessionCtrl.start = function (req,res) {
    req.cookie = {};
    if(req.headers.cookie){
        req.cookie = SessionCtrl.cookieParser(req.headers.cookie);
    }

    var sid = req.cookie['xiaolan'];
    if(!sid)sid = SessionCtrl.sid(JSON.stringify(req.headers)+(new Date().getTime()));

    if(!SessionCtrl.pool[sid]){
        SessionCtrl.pool[sid] = {};
    }
    res.setHeader("Set-Cookie", ["xiaolan="+sid]);
    SessionCtrl.pool[sid]['sessionId'] = sid;
    req.session = SessionCtrl.pool[sid];
}


//将字符串cookie转换成对象

SessionCtrl.cookieParser = function (cookie) {
    var _arr = cookie.split(';');
    var result = {};
    for(var k in _arr){
        result[_arr[k].split('=')[0].replace(' ','')] = _arr[k].split('=')[1];
    }
    return result;
}

//全局session池，在内存中存储
SessionCtrl.pool = {};



module.exports = SessionCtrl.init;

