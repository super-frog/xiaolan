/**
 * Created by lanhao on 15/5/17.
 */
var Parser = {};

//将收到的请求体queryString转换成对象
Parser.bodyParser = function(data,ct){
    var body = {};
    if(ct == 'application/json'){
        try{
            body = JSON.parse(data);
        }catch(ex){

        }
        return body;
    }else {
        if (data) {
            var _arr = data.split('&');
            var _tmp = [];
            for (var k in _arr) {
                _tmp = _arr[k].split('=');
                body[_tmp[0]] = (_tmp[1] != undefined) ? decodeURIComponent(_tmp[1]) : '';
            }
            return body;
        } else {
            return body;
        }
    }
};

// 将uri的pathInfo部分转化为对象
Parser.paramParser = function(uri){
    var params = [];
    if(uri){
        uri = uri.split('/');
        for(var k in uri){
            if(uri[k]!=''){
                params.push(uri[k]);
            }
        }
        params[0] = params[0]?params[0]:'index';
        params[1] = params[1]?params[1]:'index';
        return params;
    }else{
        return ['index','index'];
    }
}

//将get参数queryString转换为对象
Parser.queryParser = function(q){
    var query = {};
    if(q){
        q = q.split('&');
        var _tmp = [];
        for(var k in q){
            _tmp = q[k].split('=');
            query[_tmp[0]] = (_tmp[1]!=undefined)?decodeURIComponent(_tmp[1]):'';
        }
        return query;
    }else{
        return query;
    }
}

module.exports = Parser;