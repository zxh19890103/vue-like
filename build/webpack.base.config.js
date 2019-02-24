'use strict'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const util = require('./util')
const babelRC = require('./babelrc')

module.exports = {
  context: util.resolve(),
  entry: {
    app: './how-to-use-it/src/index'
  },
  output: {
    filename: "[name].[hash:7].js",
    path: util.resolve('./dist')
  },
  resolve: {
    extensions: [ '.jsx', '.js' ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
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
            // use babel rc
            options: babelRC
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
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
    new CleanWebpackPlugin([util.resolve('./dist')]),
    new HtmlWebpackPlugin({
      template: './how-to-use-it/index.html',
      filename: 'index.html'
    }),
    new ManifestPlugin()
  ]
}
