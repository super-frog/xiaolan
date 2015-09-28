/**
 * Created by lanhao on 15/5/17.
 */
module.exports = {
    'version':'1.0.0',
    'port':3001,
    'ip':null,
    'cors':false,
    'static':['js','css','jpg','png','ico'],
    'modules':{
        'mysql':{
            'import':1,
            'config':{
                "host":"127.0.0.1",
                "port":"3306",
                "user":"root",
                "password":"",
                "database":"vdb_1"
            }
        },
        'session':{
            'import':1,
            'config':{
                'age':60
            }
        }
    }
};