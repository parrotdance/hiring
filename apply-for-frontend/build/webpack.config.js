const path = require('path')
const join = (...args) => path.join(__dirname, '..', ...args)
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: join('src', 'index.tsx'),
  output: {
    filename: '[name].js',
    path: join('dist')
  },
  target: 'web',
  devtool: 'source-map',
  devServer: {
    port: 3000,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join('public', 'index.html')
    })
  ]
}
