'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    env: require('./dev.env'),
    host: 'localhost',
    port: 10015,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        // target: 'http://yssh.css-link.com/pdshop',
        target: 'http://cyc8.cn/',
        // target: 'http://test.cyc8.cn/',
        // target: 'http://localhost:8080/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    // 寰球正品后台打包地址
    // Template for index.html
    // index: path.resolve(__dirname, '../hqzp-admin/index.html'),

    // Paths
    // assetsRoot: path.resolve(__dirname, '../hqzp-admin'),
    // assetsSubDirectory: 'static',
    // assetsPublicPath: '/web/hqzp-admin/',

    // 云尚商城后台打包地址
    // Template for index.html
    index: path.resolve(__dirname, '../shop-admin/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../shop-admin'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/web/shop-admin/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
