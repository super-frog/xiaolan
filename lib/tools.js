/**
 * Created by lanhao on 15/5/18.
 */
var crypto = require('crypto');

var Tools = {};


Tools.md5 = function(data){
    var Buffer = require("buffer").Buffer;
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    data = md5sum.digest('hex');
    return data;
};

module.exports = Tools;


