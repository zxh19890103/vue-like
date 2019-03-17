const { Buffer } = require('buffer')
const buf = new Buffer.from('张9A', 'utf8')
const r = buf.readInt16BE(0)
console.log(r.toString(16))