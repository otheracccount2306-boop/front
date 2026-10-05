const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const transpiledModules = [
  'react-native-vector-icons',
  'react-native-screens',
  'react-native-safe-area-context',
  '@react-native-async-storage',
  '@react-navigation',
  'react-native-web',
];

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: path.resolve(__dirname, 'index.web.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      extensions: ['.web.js', '.web.jsx', '.js', '.jsx', '.json'],
      alias: {
        'react-native$': 'react-native-web',
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: [
            path.resolve(__dirname, 'index.web.js'),
            path.resolve(__dirname, 'App.jsx'),
            path.resolve(__dirname, 'src'),
            ...transpiledModules.map((name) => path.resolve(__dirname, 'node_modules', name)),
          ],
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              configFile: false,
              presets: ['module:@react-native/babel-preset'],
              plugins: ['react-native-web'],
            },
          },
        },
        {
          test: /\.(ttf|png|jpe?g|gif)$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'web/index.html') }),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProduction),
        'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || ''),
      }),
    ],
    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
    },
    performance: {
      hints: false,
    },
  };
};
