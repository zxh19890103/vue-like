'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const cfg = require('./config').dev

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: "#cheap-module-eval-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __PRODUCTION__: JSON.stringify(false),
    })
  ]
})

Object.keys(module.exports.entry).forEach((name => {
  const entry = module.exports.entry[name]
  module.exports.entry[name] = [
    'webpack/hot/dev-server',
    `webpack-dev-server/client?http://${cfg.host}:${cfg.port}`
  ].concat(entry)
}))
