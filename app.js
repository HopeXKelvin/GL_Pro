var express = require('express');
var app = express();// 创建一个 express实例

//服务
var port = 3000;
var server = app.listen(port,function(){
  var host = server.address().address;
  var _port = server.address().port;
  console.log('Project listening at http://%s:%s',host,port);
});

//配置静态文件路径(设置多个静态文件路径)
// app.use('/static',express.static('dist'));
app.use('/static',express.static('public'));

// 指定加载的模板以及模板引擎
app.set('views','./views');
app.set('view engine','jade');

//下面是一些路由控制
app.get('/',function(req,res){
  res.render('index');
});

//  关于架子鼓的路由控制
app.get('/drumdisplay',function(req,res){
  res.render('drum_display');
});

// 测试leap motion的页面
app.get('/lm_test',function(req,res){
  res.render('lm_test');
});

// 房屋设计页面路由
app.get('/design_index', function(req,res) {
  res.render('design_index');
});