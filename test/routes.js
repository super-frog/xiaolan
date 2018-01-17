'use strict';

const Router = require('xiaolan-router');

let router = new Router();

router.group('test').get('/{id}', 'index');

module.exports = router;
