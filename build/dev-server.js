const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const config = require(`./webpack.dev.config`)
const compiler = webpack(config)
const chalk = require('chalk').default
const cfg = require('./config').dev

const server = new webpackDevServer(compiler, {
  historyApiFallback: true,
  hot: true,
  hotOnly: true,
  inline: true,
  contentBase: [ config.output.path, ...cfg.assets ],
  stats: {
    colors: true
  },
  quiet: false,
  open: true,
})
server.listen(cfg.port, cfg.host, () => {
  console.log(chalk.green(`Starting server on http://${cfg.host}:${cfg.port}`))
})
