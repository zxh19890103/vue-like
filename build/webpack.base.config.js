'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const util = require('./util')
const babelRC = require('./babelrc')
const tplLoader = path.resolve(__dirname, '../packages/compiler/template-loader.js')
const conf = require('./config').share

module.exports = {
  context: util.resolve(),
  entry: conf.entry,
  output: {
    filename: "[name].[hash:7].js",
    path: util.resolve(conf.output)
  },
  resolve: {
    extensions: [ '.js', '.ts', '.tsx' ]
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'cache-loader'
          },
          {
            loader: 'thread-loader',
            options: {
              // there should be 1 cpu for the fork-ts-checker-webpack-plugin
              workers: require('os').cpus().length - 1
            },
          },
          {
            loader: 'babel-loader',
            options: babelRC
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.template\.html$/,
        loader: tplLoader
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 16384,
          fallback: 'file-loader',
          name: 'images/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 0,
          fallback: 'file-loader',
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([util.resolve(conf.output)]),
    new HtmlWebpackPlugin({
      template: conf.index,
      filename: 'index.html'
    }),
    new ManifestPlugin()
  ]
}
