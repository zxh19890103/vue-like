const compile = require('./compiler')

const loader = function (content, map, meta) {
  const callback = this.async()
  compile(content, (json) => {
    callback(null, `module.exports = JSON.stringify(${json})`, map, meta)
  })
}

module.exports = loader