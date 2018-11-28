'use strict';
const path = require('path');
const { EOL } = require('os');
const fs = require('fs');


class Logger {
  constructor(logPath = '/tmp') {
    this.logPath = path.resolve(logPath);
    this.streams = {};
  }

  info() {
    let ctx = [];
    for (let k in arguments) {
      ctx.push(`${arguments[k].toString()}${EOL}`);
    }
    console.trace(ctx.join(''));
  }

  debug() {
    let ctx = [];
    for (let k in arguments) {
      ctx.push(`${arguments[k].toString()}`);
    }
    this.store('debug', ctx.join(','));
  }

  info() {
    let ctx = [];
    for (let k in arguments) {
      ctx.push(`${arguments[k].toString()}`);
    }
    this.store('info', ctx.join(','));
  }

  notice() {
    let ctx = [];
    for (let k in arguments) {
      ctx.push(`${arguments[k].toString()}`);
    }
    this.store('notice', ctx.join(','));
  }

  warning() {
    let ctx = [];
    for (let k in arguments) {
      ctx.push(`${arguments[k].toString()}`);
    }
    this.store('warning', ctx.join(','));
  }

  error() {
    let ctx = [];
    for (let k in arguments) {
      ctx.push(`${arguments[k].toString()}`);
    }
    this.store('error', ctx.join(','));
  }

  critical() {
    let ctx = [];
    for (let k in arguments) {
      ctx.push(`${arguments[k].toString()}`);
    }
    this.store('critical', ctx.join(','));
  }

  alert() {
    let ctx = [];
    for (let k in arguments) {
      ctx.push(`${arguments[k].toString()}`);
    }
    this.store('alert', ctx.join(','));
  }

  emergency() {
    let ctx = [];
    for (let k in arguments) {
      ctx.push(`${arguments[k].toString()}`);
    }
    this.store('emergency', ctx.join(','));
  }

  log() {
    let ctx = [];
    for (let k in arguments) {
      ctx.push(`${arguments[k].toString()}`);
    }
    this.store('info', ctx.join(','));
  }

  store(level = 'info', context = '') {
    let day = this.getDay();
    if (!this.streams[level] || !this.streams[level][day]) {
      this.makeStream(level);
    }
    let stream = this.streams[level][day];
    stream.write(this.format(level, day, context));
  }

  makeStream(level = 'info') {
    let day = this.getDay();
    this.streams[level] = {};
    this.streams[level][day] = fs.createWriteStream(`${this.logPath}/${day}-${level}.log`, {
      flags: 'w',
      defaultEncoding: 'utf8'
    });
  }

  format(level, day, context) {
    return `[${level.toUpperCase()}] ${day}: ${context}${EOL}`;
  }

  getDay() {
    let date = new Date();
    let day = `${date.getFullYear()}-${1 + date.getMonth()}-${date.getDate()}`;
    return day;
  }
}

module.exports = Logger;