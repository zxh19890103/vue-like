const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const config = require(`./webpack.dev.config`)
const compiler = webpack(config)
const chalk = require('chalk').default
const cfg = require('./config')

const server = new webpackDevServer(compiler, {
  historyApiFallback: true,
  hot: true,
  hotOnly: true,
  inline: true,
  contentBase: [ config.output.path, ...cfg.share.assets ],
  stats: {
    colors: true
  },
  quiet: true,
  open: true,
})
const { port, host } = cfg.dev
server.listen(port, host, () => {
  console.log(chalk.green(`Starting server on http://${host}:${port}`))
})
