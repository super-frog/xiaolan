'use strict';

const Router = require('xiaolan-router');

const router = new Router();

router.use('mid').get('', 'index');

module.exports = router;
