/**
 * Created by lanhao on 2017/8/14.
 */

'use strict';

let memoryStore = {};

memoryStore.pool = {};

memoryStore.set = (sid, data) => {
  memoryStore.pool[sid] = data;
};

memoryStore.get = (sid, res)=>{
  if(memoryStore.pool[sid] === undefined){
    memoryStore.pool[sid] = {};
    res.res.setHeader('Set-Cookie', ['xiaolan=' + sid + ';path=/;HttpOnly']);
  }
  return memoryStore.pool[sid];
};

memoryStore.gc = ()=>{

};

module.exports = memoryStore;