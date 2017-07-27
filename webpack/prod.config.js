const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

  bail: true,

  devtool: 'source-map',

  entry: {
    'DPlayer': './src/index.js'
  },

  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].min.js',
    publicPath: '/'
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.scss']
  },

  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: require.resolve('eslint-loader'),
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.js$/,
        use: [
          require.resolve('template-string-optimize-loader'),
          {
            loader: require.resolve('babel-loader'),
            options: {
              compact: true,
              presets: ['env']
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: require.resolve('style-loader'),
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                minimize: true,
                sourceMap: true
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss'
              }
            },
            require.resolve('sass-loader')
          ]
        })
      },
      {
        test: /\.(png|jpg)$/,
        loader: require.resolve('url-loader'),
        options: {
          'limit': 40000
        }
      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false,
        ascii_only: true
      },
      sourceMap: true
    }),
    new ExtractTextPlugin({
      filename: '[name].min.css'
    })
  ],

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }

};
