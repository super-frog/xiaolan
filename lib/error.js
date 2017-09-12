/**
 * Created by lanhao on 2017/9/6.
 */

'use strict';

class XiaolanError {
  constructor(err) {
    this.name = err.name;
    this.code = err.code;
    this.httpStatus = err.httpStatus;
    this.message = err.message;
  }

  static makeError(err) {
    return new XiaolanError(err);
  }

  obj() {
    return {
      code: this.code,
      message: `${this.message}(${this.name})`,
      data: null,
    };
  }
}

const RegisterError = (err) => {
  ErrorShop[err.name] = new XiaolanError(err);
};

const ErrorShop = {};

module.exports = {
  XiaolanError,
  ErrorShop,
  RegisterError,
};