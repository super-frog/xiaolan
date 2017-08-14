/**
 * Created by lanhao on 2017/8/14.
 */

'use strict';

let memoryStore = {};

memoryStore.pool = {};

memoryStore.set = (sid, data) => {
  memoryStore.pool[sid] = data;
};

memoryStore.get = (sid)=>{
  return memoryStore.pool[sid];
};

memoryStore.gc = ()=>{
  console.log('No GC');
}

module.exports = memoryStore;