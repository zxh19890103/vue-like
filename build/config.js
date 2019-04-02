module.exports ={
  share: {
    index: './sw/index.html',
    entry: {
      app: './sw/index.js'
    },
    assets: ['./sw/assets'],
    output: './sw/dist'
  },
  dev: {
    port: 9003,
    host: '0.0.0.0',
  },
  build: {
    useGzip: false,
  }
}
