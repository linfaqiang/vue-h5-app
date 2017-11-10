// https://github.com/shelljs/shelljs
require('shelljs/global');
env.NODE_ENV = 'production';
var path = require('path');
var config = require('../config');
var ora = require('ora');
var webpack = require('webpack');
var webpackConfig = {};
var webpackPublicConfig = require('./webpack.public.conf');
var spinner = {};

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);

function out(stats) {
    process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
            assets: false
        }) + '\n');
}
if (process.argv[2] === 'public') {
    spinner = ora('building for production public');
    spinner.start();
    webpack(webpackPublicConfig, function (err, stats) {
        spinner.stop();
        if (err) {
            throw err;
        }
        out(stats);
    });
} else if (process.argv[2] === 'quick') {
    spinner = ora('building for production quick');
    spinner.start();
    webpackConfig = require('./webpack.prod.conf');
    webpack(webpackConfig, function (err, stats) {
        spinner.stop();
        if (err) {
            throw err;
        }
        out(stats);
    });
} else {
    spinner = ora('building for production...');
    spinner.start();
    rm('-rf', assetsPath);
    mkdir('-p', assetsPath);
    webpack(webpackPublicConfig, function (err, stats) {
        if (err) {
            spinner.stop();
            throw err;
        }
        webpackConfig = require('./webpack.prod.conf');
        webpack(webpackConfig, function (err, stats) {
            spinner.stop();
            if (err) {
                throw err;
            }
            out(stats);
        });
    });
}
