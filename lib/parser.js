/**
 * Created by lanhao on 15/5/17.
 */
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
        if (_tmp[0] === '')continue;
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
    params[0] = params[0] ? params[0] : 'index';
    params[1] = params[1] ? params[1] : 'index';
    return params;
  } else {
    return ['index', 'index'];
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
      if (_tmp[0] === '')continue;
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

Object.defineProperty(Parser, 'queryParser', {
  'value': queryParser
});

Object.defineProperty(Parser, 'cookieParser', {
  'value': cookieParser
});
module.exports = Parser;