/**
 * Created by lanhao on 15/5/17.
 */



var Controller = {};

Controller.index = (req, res, User) => {

  res.json(200, User);
  // res.end('dddds');
};


module.exports = Controller;