#!/usr/bin/env node
"use strict";


const os = require('os');
const EOL = (os && os.EOL)?os.EOL:'\n';
const fs = require('fs');
const helpers = require('./helpers');

var copy = helpers.copyR;

var exists = helpers.exists;


fs.exists( './install.locked', ( e ) => {
    // 已存在
    if( e ){
        console.log('had been installed');
    }
    // 不存在
    else{
        exists(__dirname+'/../tpl','./',copy);
        //fs.writeFileSync('./install.locked', 'install');
        console.log('R U OK ?');
    }
});


