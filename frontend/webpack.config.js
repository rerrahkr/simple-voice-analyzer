const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/ts/main.ts',
    worker: './src/js/worker.js',
    view: './src/ts/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    // Remove node module on browsers
    fallback: {
      crypto: false,
      path: false,
      fs: false,
    },
  },
  // webpack-dev-server settings
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    host: '0.0.0.0',
    port: 8080,
  },
  // Loader settigs
  module: {
    rules: [
      {
        // TypeScript compiler
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        // Babel
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      /* {
        // SCSS
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          // Bundle CSS
          {
            loader: 'css-loader',
            options: {
              url: false,
              // sourceMap: true,
            },
          },
          // SASS to CSS
          {
            loader: 'sass-loader',
            options: {
              // Use dart-scss
              implementation: require('sass'),
              // fibers does not work on node 16
              // sassOptions: {
              //   fiber: require('fibers'),
              // },
              // sourceMap: true,
            },
          },
        ],
      }, */
    ],
  },
  // Plugin settings
  plugins: [
    // Copy HTML
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      inject: false,
    }),
    // Copy other files
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'lib'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
  ],
};
