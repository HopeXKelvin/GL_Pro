# GL_Pro
webgl+leapmotion->project

## 基于webgl+leap motion开发的一个项目

### 项目基本架构

- 后台：nodejs+express框架

- 前端：vue.js+three.js+webpack

- 数据库：mysql

- 其他：使用blender建模,使用leap motion进行VR的操作

### 后台环境搭建

- 使用node,express框架前需要安装好node环境,安装node环境后会自动带上npm.后面通过npm工具进行依赖包的下载

- 安装好node,npm环境后.使用npm工具初始化一个express后台环境

    + cd到项目路径下,使用```npm init```创建环境,会自动创建一个package.json包配置管理信息的文件

    + 安装Express,并将其保存到依赖列表中：

      ```npm install express --save```

      如果只是临时安装Express,不想将它添加到依赖列表中,只需要去掉 --save参数即可(本项目中需要将其添加到依赖列表中)

    + 在根目录下创建app.js文件,里面写入控制整个项目的路由跳转的代码

    + 启动项目后台:```node app.js```

    + Express应用生成器

      通过生成器工具可以快速创建一个express应用的骨架

      安装express生成器指令：```npm install express-generator -g```

      生成项目的指令：```express myapp```(会在当前目录下创建一个名为myapp的应用)

      接下来进入myapp路径下,使用 ```npm install```安装所有依赖

      安装好所有依赖之后,启动项目：

      ```$ DEBUG=myapp npm start```(Mac或Linux平台)

      ```> set DEBUG=myapp & npm start```(windows平台)

      利用这个工具生成的项目的目录结构有一定的参考性.

    + Express托管静态文件

      Express内置有express.static可以用于设置静态文件读取路径,方便托管.

      假设静态文件在dist文件夹下面,则可以使用以下代码指定目录

      ```javascript
      app.use(express.static('public'));
      ```

      还可以设置一个虚拟目录

      ```javascript
      app.use('/static',express.static('public'));
      ```

      这样就可以通过/static路径代替public了

- 后端使用express默认的jade模板引擎进行页面的渲染(页面放在了views文件夹下)

### 前端使用的技术栈

- vue

- less
  + 安装less：```npm install -g less```
  + 命令行用法：

    直接编译：

    ```lessc style.less```

    编译到目标文件：

    ```lessc style.less style.css```

    想直接得到压缩后的css文件可以安装一个less-plugin-clean-css插件：

    ```npm install -g less-plugin-clean-css```

    使用插件编译less并生成压缩后的css：

    ```lessc --clean-css styles.less styles.min.css```

- webpack
  + 安装:```npm install --save-dev  webpack```

- three.js

### 系统说明

- 实现一个在web端可以进行交互的3D架子鼓鼓谱制作的系统

- 可以在线录制鼓谱,记录用户的敲击顺序,频率,并可以生成鼓谱(初期是生成一个简单格式的数字鼓谱)

- 可以在用户个人的文件库中选择播放列表,播放对应的鼓谱.(此处把鼓谱变成简单的数字序列,存储数字序列,播放的时候直接用数字序列来播放音频)

- 基于webgl创建一个真实性很强的3D架子鼓场景,用leap motion来进行架子鼓的敲击

- 暂定以下几个模式：1.制作模式 2.播放模式 3.跟打模式
