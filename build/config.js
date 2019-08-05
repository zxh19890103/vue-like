module.exports ={
  share: {
    index: './demo/index.html',
    entry: {
      app: './demo/bootstrap.ts'
    },
    assets: [],
    output: './demo/dist'
  },
  dev: {
    port: 9003,
    host: '0.0.0.0',
  },
  build: {
    useGzip: false,
  }
}
