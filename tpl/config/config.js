
const fs = require('fs');
const env = require('dotenvr').load();
Object.assign(process.env, env);
const config = {
  port: env['PORT'] || process.env['PORT'],
  cors: env['CORS'] || process.env['CORS'],
  session_driver: 'memory',
};

if (env['REDIS_HOST'] && env['REDIS_PORT']) {
  config.session_driver = 'redis';
}

if (fs.existsSync(process.cwd() + '/package.json')) {
  config.version = require(process.cwd() + '/package.json').version;
}

module.exports = config;