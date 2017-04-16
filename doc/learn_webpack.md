# 学习webpack笔记

## concepts(基本概念)

webpack配置项很多,也很灵活.但是最基本的要理解四个概念:entry,output,loaders,plugins

- Entry

  入口文件,entry point告诉webpack从何处开始并顺着什么样的依赖图去进行打包工作。

  可以把entry point当作上下文的根或者进入web应用的第一个文件

  最简单的配置例子如下：

  ```javascript
  module.exports = {
    entry : './path/to/my/entry/file.js'
  }
  ```

  有很多设置 进入点 的方式

    - 单一入口的语法：

    ``` entry : string | Array<string>```

    ```javascript
    const config = {
      entry : './path/to/my/entry/file.js'
    };
    module.exports = config;
    ```

    上面的写法是下面的简写形式：

    ```javascript
    const config = {
      entry : {
        main : './path/to/my/entry/file.js'
      }
    };
    ```

    备注：如果value是字符串数组，则表示具有多个入口文件

    - 对象语法：

    ```entry : {[entryChunkName : string] : string | Array<string>}```

    示例：

    ```javascript
    const config = {
      entry : {
        app : './src/app.js',
        vendors : './src/vendors.js'
      }
    };
    ```

    多页应用：

    ```javascript
    const config = {
      entry : {
        pageOne : './src/pageOne/index.js',
        pageTwo : './src/pageTwo/index.js',
        pageThree : './src/pageThree/index.js'
      }
    };
    ```

    以上配置告诉webpack，这里有三个独立的入口文件

- Output

  输出文件

  ```javascript
  const path = require('path');

  module.exports = {
    entry : './path/to/my/entry/file.js',
    output : {
      path : path.resolve(__dirname,'dist'),
      filename : 'my-first-webpack.bundle.js'
    }
  };
  ```

  output.path和output.filename给出了我们希望文件输出的路径和文件名

- Loaders

  Loaders 在webpack里面的作用是将非JS文件(其他资源)转换成模块,并添加到项目的以来当中去

  总体而言,有两个比较重要的配置项：

    1. test

    识别哪类文件需要被指定的loader转换

    2. use

    转换文件需要用到的loader

  示例代码：

  ```javascript
  const path = require('path');

  const config = {
    entry : './path/to/my/entry/file.js',
    output : {
      path : path.resolve(__dirname,'dist'),
      filename : 'my-first-webpack.bundle.js'
    },
    module : {
      rules : [
        {test : /\.(js|jsx)$/,use : 'babel-loader'}
      ]
    }
  };
  ```

  loaders是对源代码进行模块化转化的转换器。webpack允许我们在预处理文件的时候使用require()方法将我们需要的loader加入进来。因此 loaders有点像gulp里面的tasks。loader允许我们将很多其他资源转换成JS。

  举例：

  我们可以利用loaders去加载CSS文件或者将TypeScript转换成Javascritp

  首先需要安装相关的loaders

  ```
  npm install --save-dev css-loader
  npm install --save-dev ts-loader
  ```

  然后将其配置到webpack.config.js文件中

  ```javascript
  module.exports = {
    module : {
      rules : [
        {test : /\.css$/,use : 'css-loader'},
        {test : /\.ts$/,use : 'ts-loader'}
      ]
    }
  };
  ```

- Plugins

  要使用plugin，就需要把插件require()进来，并将其添加到 plugins数组里面，而且是需要通过new一个实例来使用

  ```javascript
  const config = {
    plugins : {
      new webpack.potimize.UglifyJsPlugin(),
      new HtmlWebpackPlugin({template : './src/index.html'})
    }
  }
  ```
