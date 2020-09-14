module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-react',
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ]
}
