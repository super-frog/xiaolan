/**
 * Created by lanhao on 15/5/17.
 */



var Controller = {};

Controller.index = function (req,res) {
    res.end('hello');
};

Controller.test = function(req,res){
    res.raw(418,{'content-type':'application/json'},['test']);
};
module.exports = Controller;