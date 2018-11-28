#!/usr/bin/env node
"use strict";


const os = require('os');
const EOL = (os && os.EOL) ? os.EOL : '\n';
const fs = require('fs');
const helpers = require('./helpers');

const copy = helpers.copyR;

const exists = helpers.exists;

console.log('==============='+process.cwd()+'===============');

const projectRoot = process.cwd()+'/';

fs.exists(projectRoot+'./xiaolan.locked', (e) => {
  // 已存在
  if (e) {
    console.log('had been installed');
  }
  // 不存在
  else {
    exists(__dirname + '/../tpl', projectRoot, copy);
    fs.writeFileSync('./xiaolan.locked', 'install');
    console.log('R U OK ?');
  }
});


