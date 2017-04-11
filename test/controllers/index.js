/**
 * Created by lanhao on 15/5/17.
 */



var Controller = {};

Controller.index = function (req,res) {
    res.json(200,[]);
};

Controller.detail = function(req,res){
    res.end('detail');
}

module.exports = Controller;