module.exports = {
  "presets": [
    "@babel/preset-env"
  ],
  "ignore": ["third_party"],
  "plugins": [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-transform-class-properties',
    [
      '@babel/plugin-proposal-decorators', {
        "decoratorsBeforeExport": true
    }]
  ]
}
