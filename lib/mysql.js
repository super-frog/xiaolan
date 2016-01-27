/**
 * Created by lanhao on 15/5/17.
 */

var easymysql = require('easymysql');
var mysql = {};

//mysql.conn = null;
var _conn = null;

Object.defineProperty(mysql,'conn',{
    get: function () {
        return _conn;
    },
    set: function (v) {
        _conn = v ;
    }
});

//mysql连接池的单例实现
Object.defineProperty(mysql,'init',{
    value:function (config) {
        if(!mysql.conn){
            var conn = easymysql.create({
                'maxconnections':10
            });
            conn.addserver(config);
            mysql.conn = conn;
            return mysql.conn;
        }else{
            return mysql.conn;
        }
    }
});



module.exports = mysql.init;

