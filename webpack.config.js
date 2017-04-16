var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 多个实例
// var extractLess = new ExtractTextPlugin('[name].min.css');

module.exports = {
  entry : {
    index : './public/scripts/index',
    drum_display : ['./public/scripts/drum_display']
  },
  output : {
    filename : '[name].js',
    path : path.resolve(__dirname,'dist/scripts')
  },
  module : {
    rules : [
      {
        test : /\.less$/,
        use : ExtractTextPlugin.extract({
          fallback : 'style-loader',
          use : ['css-loader','less-loader']
        })
        // use : [
        //   {loader : 'style-loader'},// create style nodes from JS strings
        //   {loader : 'css-loader'},// 把CSS转化成CommonJS(问好脸,css还能转成 commonjs?)
        //   {loader : 'less-loader'}// 把Less编译成CSS
        // ]
      }
    ]
  },
  plugins : [
    new ExtractTextPlugin('./../styles/[name].min.css')
  ]
};

// module.exports = {
//   entry : {
//     index : './public/styles/less/index.less',
//     drum_display : './public/styles/less/drum_display.less'
//   },
//   output : {
//     filename : '[name].css',
//     path : path.resolve(__dirname,'dist/styles')
//   },
//   module : {
//     rules : [
//       {
//         test : /\.less$/,
//         use : ExtractTextPlugin.extract({
//           fallback : 'style-loader',
//           use : ['css-loader','less-loader']
//         })
//         // use : [
//         //   {loader : 'style-loader'},// create style nodes from JS strings
//         //   {loader : 'css-loader'},// 把CSS转化成CommonJS(问好脸,css还能转成 commonjs?)
//         //   {loader : 'less-loader'}// 把Less编译成CSS
//         // ]
//       }
//     ]
//   },
//   plugins : [
//     new ExtractTextPlugin('[name].css')
//   ]
// };
