/**
 * Created by lanhao on 22/6/17.
 */

const config = require('dotenvr').load();
console.log(config);
module.exports = {
  'version': '1.0.0',
  'port': 3001,
  'ip': null,
  'cors': false,
  'static': ['js', 'css', 'jpg', 'png', 'ico'],
  'modules': {
    'mysql': {
      'import': 0,
      'config': {
        "host": "127.0.0.1",
        "port": "3306",
        "user": "root",
        "password": "",
        "database": "vdb_1"
      }
    },
    'session': {
      'import': 1,
      'config': {
        'store':'file',//memory [file]
        'path':'/Users/lanhao/tmp/sessions',
        'age': 60
      }
    }
    ,
    'tools': {
      'import': 1,
      'config': {}
    },
    'redis':{
      'import':0,
      'config':{
        'port':6379,
        'host':'127.0.0.1'
      }
    }
  }
};