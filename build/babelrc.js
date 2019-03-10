module.exports = {
  "presets": [
    ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
    "@babel/preset-env"
  ],
  "ignore": ["third_party"],
  "plugins": [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', { "legacy": true }],
    ['@babel/plugin-proposal-class-properties', { "loose": false }]
    //'babel-plugin-transform-class-properties',
  ]
}
