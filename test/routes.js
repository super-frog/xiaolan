'use strict';

const Router = require('xiaolan-router');

let router = new Router();

router.use('mid').get('', 'index');

module.exports = router.map();
