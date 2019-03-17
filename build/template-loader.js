const path = require('path')
const fs = require('fs')
const compile = require('../packages/compiler/compiler')

const loader = function (content, map, meta) {
  console.log('.....Tpl')
  console.log(content)
  const callback = this.async()
  compile(content, (json) => {
    console.log(json)
    callback(null, `module.exports = JSON.stringify(${json})`, map, meta)
  })
}

module.exports = loader