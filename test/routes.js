'use strict';

const Router = require('xiaolan-router');

let router = new Router();

router.get('/{id}', 'index');

module.exports = router.map();
