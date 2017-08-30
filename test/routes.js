'use strict';

const Router = require('xiaolan-router');

let router = new Router();

router.get('', 'index.index');

module.exports = router.map();

/*
 * same as

module.exports = {
  'get /': 'index.index',
  'get /test': 'index.kaka',
  'delete /{id}': 'index.index'
};

 */