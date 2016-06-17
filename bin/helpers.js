/**
 * Created by lanhao on 16/6/15.
 */

'use strict';
const fs = require('fs');
const stat = fs.stat;

let helpers = {};

helpers.copyR = ( src, dst ) => {
    // 读取目录中的所有文件/目录
    fs.readdir( src, ( err, paths ) => {
        if( err ){
            throw err;
        }

        paths.forEach(( path ) => {
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;

            stat( _src, ( err, st )=>{
                if( err ){
                    throw err;
                }

                // 判断是否为文件
                if( st.isFile() ){
                    // 创建读取流
                    readable = fs.createReadStream( _src );
                    // 创建写入流
                    writable = fs.createWriteStream( _dst );
                    // 通过管道来传输流
                    readable.pipe( writable );
                }
                // 如果是目录则递归调用自身
                else if( st.isDirectory() ){
                    helpers.exists( _src, _dst, helpers.copyR );
                }
            });
        });
    });
};

helpers.exists = ( src, dst, callback ) => {
    fs.exists( dst, function( exists ){
        // 已存在
        if( exists ){
            callback( src, dst );
        }
        // 不存在
        else{
            fs.mkdir( dst, () => {
                callback( src, dst );
            });
        }
    });
};

module.exports = helpers;