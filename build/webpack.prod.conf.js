var path = require('path');
var fs = require('fs');
var config = require('../config');
var utils = require('./utils');
var webpack = require('webpack');
var merge = require('webpack-merge');
var AddFilesWebpackPlugin = require('./add-files-webpack-plugin');
var baseWebpackConfig = require('./webpack.base.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var projectRoot = path.resolve(__dirname, '../');
var env = config.build.env;

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({
      // sourceMap: config.build.productionSourceMap,
      // extract: true
    })
  },
  // devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    publicPath: '../',
    // filename: utils.assetsPath('js/[name].[chunkhash].js'),
    filename: '[name]/[name].js',
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  vue: {
    loaders: utils.cssLoaders({
      // sourceMap: config.build.productionSourceMap,
      // extract: true
    })
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/workflow/production.html
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

    // extract css into its own file
    // new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),
    new webpack.DllReferencePlugin({
      context: projectRoot,
      manifest: JSON.parse(fs.readFileSync(path.resolve(config.build.assetsRoot, 'public/manifest.json'), 'utf8'))
    }),
    new AddFilesWebpackPlugin({path: '../public/js/public.js'})
  ]
});

for (var key in webpackConfig.entry) {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: key + '/index.html',
      template: 'index.html',
      chunks: [key],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
        // removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunksSortMode: 'dependency'
    })
  );
}

module.exports = webpackConfig;
