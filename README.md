# hello ,xiaolan

## install

输入命令：

> `sudo npm install xiaolan --save`  

初始化项目:

> `./node_modules/.bin/xiaolan_init`

看到 ｀R U OK ?｀ 表示已经初始化完毕


## 用法

### 目录结构
    /config/                            全局配置文件
        /config.js
        
    /controllers/                       控制层，主要逻辑在这里写
        /index.js
        
    /models/                            模型层文件，不一定用到
        /index.js
        
    /node_modules/                      模块
        ...
        
    /views/                             试图层文件
        /css/
            /style.css
        /html/
            /index.html
        /img/
            /logo.png
        /js/
            /common.js              
            
    /server.js                          程序入口
    
    /package.json                       npm依赖管理
    
    /install.locked                     初始化后出现的锁定文件，防止误操作再次初始化
    

### server.js 入口文件
xiaolan的入口文件只需要 3 行代码

    //引入配置文件
    var config = require('./config/config');
    
    //引入Fio框架
    var xiaolan = require('xiaolan')(config);
    
    //启动监听服务
    xiaolan.createServer();
    
### 业务逻辑怎么写
>xiaolan没有采取 Express 风格的复杂路由系统，而是 `pathInfo` 风格
>
>当你访问：`http://yourdomain.com/article/list` 时,
>
>xiaolan会自动调用 `/controllers/article.js` 里的  `list` 方法，
>
>如果方法不存在，返回404 not found。
>
>事实证明，这样比路由快多了。
>
> P.S. pathInfo 不成功时，默认调用  `/index/index`


### xiaolan内置模块
xiaolan有很多系统内置模块。。。。在计划中，
目前已经有一个：mysql，配置文件中有这么一段：

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
        }
    }    
>所有内置模块以K->V的方式写在配置文件的modules里，

>import表示是否引入，可以按项目需求是否使用，按需加载。

>config表示传入的配置，这里表示mysql连接的参数。

>如何使用? 参考：/controllers/index.js
    
    var db = global.app.libs['mysql'];  //通过global.libs引入
    var Controller = {};
    
    Controller.index = function (req,res) {
        //然后就可以使用mysql的方法了
        db.query('select * from test', function (e,r) {
            console.log(r);
        });
        res.end('hello');
    };
    
    module.exports = Controller;

后续会有更多的内置模块，敬请期待