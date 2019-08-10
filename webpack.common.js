const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Private Util
const { generateHtmlPlugins, generateJsEntries } = require('./webpack-util/dir-util')

const htmlPlugins = generateHtmlPlugins(__dirname, './src/pages')
const jsEntries = generateJsEntries(__dirname, './src/assets/js')

module.exports = {
  entry: jsEntries,
  output: {
    filename: 'assets/js/[name].bundle.js',
    path : path.resolve(__dirname, 'dist')
  },
  devtool : 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  module : {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
            '@babel/preset-env'
            ]
          }
        }],
        exclude: /node_modules/,
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
    })
  ].concat(htmlPlugins)
};