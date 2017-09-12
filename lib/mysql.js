/**
 * Created by lanhao on 15/5/17.
 */
"use strict";
const nodeV = process.versions.node.split('.')[0];

let easymysql;
if (nodeV >= 6) {
  easymysql = require('fy-mysql');
} else {
  easymysql = require('easymysql');
}
const mysql = {};

//mysql.conn = null;
let _conn = null;

Object.defineProperty(mysql, 'conn', {
  get: () => {
    return _conn;
  },
  set: (v) => {
    _conn = v;
  }
});

//mysql连接池的单例实现
Object.defineProperty(mysql, 'init', {
  value: (config) => {
    if (!mysql.conn) {
      let conn = easymysql.create({
        'maxconnections': 10
      });
      conn.addserver(config);
      mysql.conn = conn;
      return mysql.conn;
    } else {
      return mysql.conn;
    }
  }
});


module.exports = mysql.init;

