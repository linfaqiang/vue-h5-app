var path = require('path');
var config = require('../config');
var webpack = require('webpack');
var utils = require('./utils');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var projectRoot = path.resolve(__dirname, '../');
var arrExports = [
  {
    login: './src/login/login.js',  // 登录
    activity: './src/activity/activity.js',  // 活动功能
    customer: './src/customer/customer.js',  // 客户功能
    customerDistribution: './src/customerDistribution/customer.js', //客户分配
    chance: './src/chance/chance.js',  // 商机功能
    customerMap: './src/customerMap/customer.js',  // 地图选择客户
    contact: './src/contact/contact.js',  // 联系人
    message: './src/message/message.js',  // 消息
    search: './src/search/search.js',  // 搜索
    cluesDistribution: './src/cluesDistribution/clue.js', //线索分配
    cluesManage: './src/cluesManage/clue.js', //线索
    cluesPool: './src/cluesPool/pool.js', //线索池
    competitor: './src/competitor/competitor.js', //竞争对手
    salesReport: './src/salesReport/report.js', //报表
    signRecord: './src/signRecord/sign.js', //签到记录
    funnel: './src/funnel/funnel.js', //销售漏斗图
    workReport: './src/workReport/work.js', //工作报告
    market: './src/market/market.js', //市场活动
    marketInformation: './src/marketInformation/market.js', //市场资讯
    marketDocuments: './src/marketDocuments/market.js', //市场文档
    schedule: './src/schedule/schedule.js', //日程
    priceApproval: './src/priceApproval/price.js', //报价审批
    productManual: './src/productManual/product.js', //产品手册
    salesPlans: './src/salesPlans/plan.js', //销售计划
    salesPrice: './src/salesPrice/price.js', //销售报价
    taskManage: './src/taskManage/task.js',//任务
    home: './src/home/home.js', //首页
    workbench: './src/workbench/workbench.js', //工作台
    addschedule: './src/addschedule/addschedule.js', //工作台
    setting: './src/setting/setting.js', //设置
    calendar: './src/calendar/calendarRoute.js', //日历
  },
  {
    login: './src/login/login.js',  // 登录
    activity: './src/activity/activity.js',  // 活动功能
    customer: './src/customer/customer.js',  // 客户功能
    customerDistribution: './src/customerDistribution/customer.js', //客户分配
    customerMap: './src/customerMap/customer.js',  // 地图选择客户
    contact: './src/contact/contact.js',  // 联系人
    message: './src/message/message.js',  // 消息
    search: './src/search/search.js',  // 搜索
    salesReport: './src/salesReport/report.js', //报表
    signRecord: './src/signRecord/sign.js', //签到记录
    workReport: './src/workReport/work.js', //工作报告
    market: './src/market/market.js', //市场活动
    marketInformation: './src/marketInformation/market.js', //市场资讯
    marketDocuments: './src/marketDocuments/market.js', //市场文档
    schedule: './src/schedule/schedule.js', //日程
    productManual: './src/productManual/product.js', //产品手册
    taskManage: './src/taskManage/task.js' //任务
  }
];
module.exports = {
  entry: arrExports[0],
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: '[name]/[name].js'
  },
  resolve: {
    root: [path.join(__dirname, '../node_modules'), path.join(__dirname, '../src')],
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'mui': path.resolve(__dirname, '../src/public/js/mui.min'),
      'components': path.resolve(__dirname, '../src/public/js/components'),
      'nativeApi': path.resolve(__dirname, '../src/public/js/nativeApi'),
      'configPort': path.resolve(__dirname, '../src/public/js/config'),
      'fastclick': path.resolve(__dirname, '../src/public/js/fastclick'),
      'db.sqlite': path.resolve(__dirname, '../src/public/js/db.sqlite'),
      'mui.picker.min': path.resolve(__dirname, '../src/public/js/mui.picker.min'),
      'mui.poppicker': path.resolve(__dirname, '../src/public/js/mui.poppicker'),
      'mui.previewimage': path.resolve(__dirname, '../src/public/js/mui.previewimage'),
      'mui.pullToRefresh': path.resolve(__dirname, '../src/public/js/mui.pullToRefresh'),
      'mui.pullToRefresh.material': path.resolve(__dirname, '../src/public/js/mui.pullToRefresh.material'),
      'mui.view': path.resolve(__dirname, '../src/public/js/mui.view'),
      'mui.zoom': path.resolve(__dirname, '../src/public/js/mui.zoom')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: [/node_modules/, /calendar/, /public/, /jquery/, /MD5/, /base64/, /sdk/, /ytx-web-im-sdk/]
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: [/node_modules/, /public/, /jquery/, /MD5/, /base64/, /sdk/, /ytx-web-im-sdk/]
      }
    ],
    loaders: [
      {
        test: /vux.src.*?js$/,
        loader: 'babel',
        exclude: [/node_modules/, /mui/, /citydata/, /echart/, /jquery/, /MD5/, /base64/, /sdk/, /ytx-web-im-sdk/]
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [/node_modules/, /mui/, /citydata/, /echart/, /jquery/, /MD5/, /base64/, /sdk/, /ytx-web-im-sdk/]
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 1,
          name: utils.assetsPath('images/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 1,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      mui: 'mui',
      nativeApi: 'nativeApi'
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/index.html'
      }])
  ],
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  vue: {
    loaders: utils.cssLoaders()
  }
};
