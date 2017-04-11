var path = require('path');

module.exports = {
  entry : {
    index : './public/scripts/index',
    drum_display : ['./public/scripts/lib/three','./public/scripts/lib/MTLLoader','./public/scripts/lib/OBJLoader','./public/scripts/drum_display']
  },
  output : {
    filename : '[name].js',
    path : path.resolve(__dirname,'dist/scripts')
  },
  module : {
    rules : [
      {
        test : /\.less$/,
        use : [
          {loader : 'style-loader'},// create style nodes from JS strings
          {loader : 'css-loader'},// 把CSS转化成CommonJS(问好脸,css还能转成 commonjs?)
          {loader : 'less-loader'}// 把Less编译成CSS
        ]
      }
    ]
  }
};
