const path = require('path')
const chalk = require('chalk').default

const cwd = process.cwd()

console.log(chalk.yellow(`Your project is running in ${cwd}`))

module.exports = {
  resolve: (...pathSegments) => {
    return path.resolve(cwd, ...pathSegments)
  }
}
