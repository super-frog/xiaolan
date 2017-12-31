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
    this._extnedMessage = '';
  }

  static makeError(err) {
    return new XiaolanError(err);
  }

  withMessage(message){
    this._extnedMessage = message;
  }

  obj() {
    let message = `${this.message}: ${this._extnedMessage || ''}`;
    this._extnedMessage = '';
    return {
      code: this.code,
      message: `[${this.name}]${message}`,
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