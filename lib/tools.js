/**
 * Created by lanhao on 15/5/18.
 */
"use strict";

const crypto = require('crypto');

const Tools = {};

Tools.init = () => {
  return Tools;
};

Tools.md5 = (data) => {
  let Buffer = require("buffer").Buffer;
  let buf = new Buffer(data);
  let str = buf.toString("binary");
  let md5sum = crypto.createHash('md5');
  md5sum.update(str);
  data = md5sum.digest('hex');
  return data;
};


module.exports = Tools.init;


