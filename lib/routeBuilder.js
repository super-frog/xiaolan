/**
 * Created by lanhao on 2017/8/14.
 */

'use strict';

class Router {
  constructor() {
    this.prefix = '';
    this.data = {};
  }

  get(path, handler) {
    this.data.get = this.data.get || {};
    path = path.startsWith('/') ? path : '/' + path;
    this.data.get[this.prefix + path] = handler;
    return this;
  }

  put(path, handler) {
    this.data.put = this.data.put || {};
    path = path.startsWith('/') ? path : '/' + path;
    this.data.put[this.prefix + path] = handler;
    return this;
  }

  post(path, handler) {
    this.data.post = this.data.post || {};
    path = path.startsWith('/') ? path : '/' + path;
    this.data.post[this.prefix + path] = handler;
    return this;
  }

  delete(path, handler) {
    this.data.delete = this.data.delete || {};
    path = path.startsWith('/') ? path : '/' + path;
    this.data.delete[this.prefix + path] = handler;
    return this;
  }

  group(prefix) {
    this.prefix = prefix.startsWith('/') ? prefix : '/' + prefix;
    return this;
  }

  reset() {
    this.prefix = '';
    return this;
  }

  map() {
    let map = {};
    for (let method in this.data) {
      for (let path in this.data[method]) {
        path = (!path.startsWith('/')) ? '/' + path : path;
        map[`${method} ${path}`] = this.data[method][path];
      }
    }
    return map;
  }
}

module.exports = Router;
