/**
 * Created by lanhao on 22/6/17.
 */
"use strict";

const config = require('dotenvr').load();

module.exports = {
  'version': config['VERSION'],
  'port': config['PORT'],
  'ip': config['IP'],
  'cors': config['CORS'],
  'static': config['STATIC_FILE'].split(','),
  'modules': {
    'mysql': {
      'import': config['MYSQL'] === 'on'?1:0,
      'config': {
        "host": config['MYSQL_HOST'],
        "port": config['MYSQL_PORT'],
        "user": config['MYSQL_USER'],
        "password": config['MYSQL_PASSWORD'],
        "database": config['MYSQL_DATABASE']
      }
    },
    'session': {
      'import': 1,
      'config': {
      }
    }
    ,
    'tools': {
      'import': 1,
      'config': {}
    },
    'redis':{
      'import':config['REDIS'] === 'on'?1:0,
      'config':{
        'port':config['REDIS_PORT'],
        'host':config['REDIS_HOST']
      }
    }
  }
};
