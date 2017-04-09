var express = require('express');
var app = express();// 创建一个 express实例

//服务
var port = 3000;
var server = app.listen(port,function(){
  var host = server.address().address;
  var _port = server.address().port;
  console.log('Project listening at http://%s:%s',host,port);
});

//配置静态文件路径
app.use('/static',express.static('dist'));
// 指定加载的模板以及模板引擎
app.set('views','./views')
app.set('view engine','jade')

//下面是一些路由控制
app.get('/',function(req,res){
  res.render('index');
});
