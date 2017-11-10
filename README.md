# crm 产品

## Build Setup

``` bash
# 安装依赖
npm install
npm install -g gulp

# 启动本地服务，在8080端口访问
npm run dev

# 构建发布版本
# 第一次构建生成到dist目录下
npm run build

# 快速构建模块(构建除public下的所有文件)
# 在运行过npm run build生成dist目录的基础上运行
# 注意 -- 和 quick 之间要空格隔开
npm run build -- quick

# 构建public模块(只构建public模块)
# 在运行过npm run build生成dist目录的基础上运行
# 注意 -- 和 public 之间要空格隔开
npm run build -- public

# zip file
# 会对/dist下文件按模块压缩
gulp zip

```
##目录说明
#####/src 源码目录，每个模块一个文件夹，文件夹名称为模块名称，其中与模块同名的js文件中进行vue路由的初始化及配置，引入模块less文件
#####/src/public 公共资源目录
#####/src/public/components 公共组件
#####/src/public/config.js 项目配置文件，配置项目接口地址，每个接口都必须注释说明
#####/src/app.vue 路由初始化根组件，设置全局样式
#####/build webpack配置文件
#####/config webpack环境地址配置文件
#####/index.html项目的html模版文件
#####/.eslintrc代码规范检测配置文件
#####/dist 打包生成目录，自动生成
#####/zip 压缩包生成目录，自动生成

##新建模块配置步骤
> 1.在src下新建模块文件夹，添加对应的一个入口js，一个模块的less文件，和其他的vue文件

> 2.配置build/webpack.base.conf.js文件中module.exports.entry添加模块名称和入口地址。

> 3.在src/index.html中添加跳转模块的链接。

> 4.在项目目录下运行 `npm run dev` 在本地启动服务打开<http://localhost:8082/login/index.html>查看模拟工作区。继续进行代码调试

> 5.在项目目录下运行`npm run build ` 在dist目录下生成发布文件。运行`gulp zip`,在zip目录下生成对应压缩文件。

> 6.将压缩文件上传后台对应模块，在移动端运行。

##规范
* 使用eslint进行代码规范检测，在运行`npm run dev`和`npm run build`时都会进行自动检测，检测不通过会报错。
* [基础规范](https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style)。
* 强制使用分号。
* 变量命名使用驼峰规则，禁止无意义或者歧义的名称,禁止使用拼音命名。
* 文件命名使用中划线分割，禁止无意义或者歧义的名称,禁止使用拼音命名。

##版本控制
* 项目使用git进行项目版本管理。
* 只提交项目源码目录src和项目构建配置文件，
  其他生成文件，项目依赖及无关文件不要提交上传，在.gitignore文件已经配置。
* 每次push之前必须提交或储存然后pull，解决冲突后再push。
* 每次提交的必须是一个可以运行的版本，禁止将运行报错的版本提交。
* 每个功能的修改都提交一次，禁止一次提交大量改动代码。
* 每天下班前必须push代码到服务器。
* 建议使用soucetree图形化软件进行管理。

##项目使用框架与库
* [Vue](http://vuejs.org.cn/guide/) mvvm框架
* [Vue-route](http://router.vuejs.org/zh-cn/view.html) Vue的官方路由插件
* [mui](http://dev.dcloud.net.cn/mui/)对mui源码进行了部分修改

##项目开发工具
* webstorm 编辑器
* vue-for-idea webstorm的
* chrome 浏览器
* vue-devtools Vue的chrome调试插件

##注意
* 每个模块只写一个less文件，在js文件中require引入，在vue文件中不再重复引入。

##常见问题说明
* npm run dev运行时没有热加载
  > 重启服务
* npm 安装错误
  > mac需要管理员权限在命令前加sudo运行
  > 国内网络问题，可以取消重新下载
* npm run dev 运行时默认的8080端口被占用
  > 关闭占用8080端口的进程
  > 或者修改config/index.js下的端口

#crm 产品
> by hj
1.	更新配置文件
2.	根据配置文件运行命令：sudo npm install或者npm install -g cnpm --registry=https://registry.npm.taobao.org  安装
3．代码修改：将CRM代码改成webpack 所要求的代码规范。
* 代码规范
*   每行代码缩进2个空格
*   不能用双引号,只能用单引号
*   每个关键字后,需要一个空格,比如:for () {};/* 注释 */
*   "=="由"==="代替,"!="由"!=="代替
*   翻页标签<mui-scroll-refresh bottom="0px" top="84px">  属性 "top","bottom" 的值需要加上单位,如上
*   路由跳转 windou.router.go("")  由  this.$router.go() 替换
*   每句代码后一定要加分号结尾
*   定义了变量,则这个变量必须要用
*   三目运算符 需要改写成 if 形式

by wangcf
1.  编辑器import报错解决办法:language & Frameworks下边的javascript language version选择ECMAScript6
