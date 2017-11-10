/**
 * @file 公共包打包配置
 * @author renjian
 * @date 2016/8/4
 */
var path = require('path');
var config = require('../config');
var utils = require('./utils');
var webpack = require('webpack');
var env = config.build.env;
var projectRoot = path.resolve(__dirname, '../');
module.exports = {
  entry: {
    public: [
      './src/public/js/mui.min.js',
      './src/public/js/fastclick.js',
      './src/public/js/config.js',
      './src/public/js/nativeApi.js',
      './src/public/components/crm-activity/list.vue',
      './src/public/components/crm-activity/detail.vue',
      './src/public/components/crm-detail/crm-detail.vue',
      './src/public/components/crm-iconBtn/crm-icon.vue',
      './src/public/components/crm-new/crm-newpage.vue',
      './src/public/components/employee/index.vue',
      './src/public/components/employee/em-store.js',
      './src/public/components/employee/dept-list.vue',
      './src/public/components/employee/person-list.vue',
      './src/public/components/employee/search-selected.vue',
      './src/public/components/listsingle/crm-listicon.vue',
      './src/public/components/listsingle/crm-listsingle.vue',
      './src/public/components/mui-scroll-refresh/mui-scroll-refresh.vue',
      './src/public/components/multiple/multiple.vue',
      './src/public/components/notes/notes.vue',
      './src/public/components/notes/notes-store.js',
      './src/public/components/notes/add.vue',
      './src/public/components/product/list.vue',
      './src/public/components/select/select.vue',
      './src/public/components/team/team.vue',
      './src/public/components/team/team-store.js',
      './src/public/components/team/teamAdd.vue',
      './src/public/js/crm-verify.js',
      './src/public/js/db.sqlite.js',
      './src/public/js/tools.js',
      './src/public/js/mui.indexedlist.js',
      './src/public/js/mui.picker.min.js',
      './src/public/js/mui.poppicker.js',
      './src/public/js/mui.previewimage.js',
      './src/public/js/mui.pullToRefresh.js',
      './src/public/js/mui.pullToRefresh.material.js',
      './src/public/js/mui.view.js',
      './src/public/js/mui.zoom.js',
      'vue',
      'vue-resource',
      'vue-router'
    ]
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: '../',
    filename: '[name]/js/[name].js',
    library: '[name]'
  },
  resolve: {
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
        // include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /vux.src.*?js$/,
        loader: 'babel',
        exclude: [/node_modules/, /mui/, /citydata/]
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [/node_modules/, /mui/, /citydata/]
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
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 100,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': env
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   sourceMap: false
    // }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DllPlugin({
      path: path.resolve(config.build.assetsRoot, '[name]/manifest.json'),
      name: '[name]',
      context: projectRoot
    })
  ],
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  vue: {
    loaders: utils.cssLoaders()
  }
};
