/**
 * Created by lanhao on 15/5/17.
 */
"use strict";
const Parser = {};

const cookieParser = (cookie) => {
  let _arr = cookie.split(';');
  let result = {};
  for (let k in _arr) {
    let [key, value] = _arr[k].split('=');
    if (key === undefined || value === undefined) {
      continue;
    }
    result[_arr[k].split('=')[0].replace(' ', '')] = _arr[k].split('=')[1];
  }
  return result;
}

//将收到的请求体body转换成对象
const bodyParser = (data, ct) => {
  let body = {};
  if (ct && ct.startsWith('application/json')) {
    try {
      body = JSON.parse(data);
    } catch (ex) {

    }
    return body;
  } else {
    if (data) {
      let _arr = data.split('&');
      let _tmp;
      for (let k in _arr) {
        _tmp = _arr[k].split('=');
        if (_tmp[0] === '') continue;
        body[_tmp[0]] = (_tmp[1] !== undefined) ? decodeURIComponent(escape(_tmp[1])) : '';
      }
      return body;
    } else {
      return body;
    }
  }
};

// 将uri的pathInfo部分转化为对象
const paramParser = (uri) => {
  let params = [];
  if (uri) {
    uri = uri.split('/');
    for (let k in uri) {
      if (uri[k] !== '') {
        params.push(uri[k]);
      }
    }
    return params;
  } else {
    return ['index', 'index'];
  }
};

const paramPicker = (routePath, data) => {
  let result = {};
  let paths = routePath.split('/');
  let index = 0;

  for (let k in paths) {
    if (paths[k] === '') {
      index++;
      continue;
    }
    if (paths[k].startsWith('{') && paths[k].endsWith('}')) {
      let key = paths[k].replace(/{|}/g, '');
      let type = 'string';
      if (key.includes(':')) {
        [key, type] = key.split(':');
      }
      result[key] = data2type(data[1 * k - index], type);
    }

  }
  return result;
};

const data2type = (data, type) => {
  switch (type) {
    case 'number':
      return Number.parseFloat(data);
    case 'boolean':
      return data === 'true' ? true : false;
    default:
      return data;
  }
};

//将get参数queryString转换为对象
const queryParser = (q) => {
  let query = {};
  if (q) {
    q = q.split('&');
    let _tmp;
    for (let k in q) {
      _tmp = q[k].split('=');
      if (_tmp[0] === '') continue;
      query[_tmp[0]] = (_tmp[1] !== undefined) ? decodeURIComponent(escape(_tmp[1])) : '';
    }
    return query;
  } else {
    return query;
  }
};


Object.defineProperty(Parser, 'bodyParser', {
  'value': bodyParser
});

Object.defineProperty(Parser, 'paramParser', {
  'value': paramParser
});

Object.defineProperty(Parser, 'paramPicker', {
  'value': paramPicker
});

Object.defineProperty(Parser, 'queryParser', {
  'value': queryParser
});

Object.defineProperty(Parser, 'cookieParser', {
  'value': cookieParser
});
module.exports = Parser;