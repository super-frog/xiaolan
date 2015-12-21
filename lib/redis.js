/**
 * Created by lanhao on 15/5/17.
 */

var redis = require('redis');

var Redis = {};

Redis.conn = null;


Redis.connect = function (config) {
  if (!Redis.conn) {
    Redis.conn = redis.createClient(config.port, config.host, {});
    return Redis;
  } else {
    return Redis;
  }
};

Redis.has = function (key,cb) {
  Redis.conn.send_command('EXISTS',[key], function (e, r) {
    cb(e,r);
  });
};

Redis.saveObj = function(key,obj,cb){
  Redis.conn.HMSET(key,obj,cb);
};

Redis.increase = function(args,cb){
  Redis.conn.send_command('HINCRBY',args,function(err,rep){
    //args  [key fiels 1]
    cb(err,rep);
  });

};


Redis.saveExpireObj = function(key,obj,expire,cb){
  Redis.conn.HMSET(key,obj,function(e){
    if(e){
      cb(e);
      return;
    }
    Redis.conn.EXPIRE(key,expire,function(ee,rr){
      cb(ee,rr);
    });
  })
};

Redis.incrby = function (args,cb) {
  Redis.conn.send_command('INCRBY',args,function(err,rep){
    //args  [key fiels 1]
    cb(err,rep);
  });
};

Redis.getObj = function(key,cb){
  Redis.conn.hgetall(key,function(e,r){
    cb(e,r);
  });
};

Redis.getValue = function(key,cb){
  Redis.conn.get(key,function(e,r){
    cb(e,r);
  });
};

Redis.saveValue = function(key,value,cb){
  Redis.conn.set(key,value,function(e,r){
    cb(e,r);
  });
};

Redis.addSet = function(key,member,score,cb){
  Redis.conn.send_command('ZADD',[key,score,member],function(e,r){
    cb(e,r);
  });
};

Redis.getSet = function(key,cb){
  Redis.conn.send_command('ZRANGE',[key,0,-1],function(e,r){
    cb(e,r);
  });
};

Redis.setCache = function(key,value,seconds,cb){
  Redis.conn.send_command('SETEX',[key,seconds,value],function(e,r){
    cb(e,r);
  });
};

Redis.push = function(key,value,cb){
  Redis.conn.send_command('RPUSH',[key,value],function(e,r){
    cb(e,r);
  });
};

Redis.pop = function(key,cb){
  Redis.conn.send_command('LPOP',[key],function(e,r){
    cb(e,r);
  });
};

module.exports = Redis.connect;

