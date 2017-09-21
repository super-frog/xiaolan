/**
 * Created by lanhao on 2017/9/21.
 */

'use strict';
const {Field, Table, Migrate} = require('xiaolan-db');

module.exports = new Table('my_user', {
  id:Field.name('user_id').bigint(true).primary().AI().comment('p id'),
  name: Field.name("user_name").varchar(64).allowNull().default("foo").uniq('u_a').comment("name of user"),
  age: Field.name("user_age").tinyint().default(10).comment('ages').index()
});
