/**
 * Created by lanhao on 15/5/17.
 */



var Controller = {};

Controller.index = function (req,res) {
    res.end('hello');
};

Controller.test = function(req,res){
    res.end('test');
};
module.exports = Controller;