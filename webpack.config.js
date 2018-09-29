const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    });
  });
}

const htmlPlugins = generateHtmlPlugins('./src/html/views');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: ['./scss/style.scss', './js/index.js'],
  output: {
    filename: './js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    host: 'localhost', // default
    port: '8080', // default
    contentBase: [__dirname + '/src/html/views', __dirname + '/src/html/includes'],
    hot: true,
    watchContentBase: true,
  },
  devtool: isProduction ? '' : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader?optional[]=runtime',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                },
              ],
            ],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: [
          {
            loader: 'css-hot-loader',
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['> 1%', 'last 2 versions'],
                }),
                require('postcss-discard-comments')({}),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/includes'),
        use: ['raw-loader'],
      },
    ],
  },
  externals: {
    jquery: 'jQuery',
    vue: 'Vue',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/style.bundle.css',
    }),
    new SVGSpritemapPlugin({
      src: './src/svgbeforesprite/**/*.svg',
      filename: './img/svg/spritemap.svg',
      gutter: 0,
      generateTitle: false,
      generateUse: false,
      svg4everybody: true,
      styles: './src/scss/_sprite.scss',
    }),
    new CopyWebpackPlugin([
      {
        from: './fonts',
        to: './fonts',
      },
      {
        from: './favicon',
        to: './favicon',
      },
      {
        from: './img',
        to: './img',
      },
      {
        from: './uploads',
        to: './uploads',
      },
    ]),
    new webpack.HotModuleReplacementPlugin(),
  ].concat(htmlPlugins),
};

if (isProduction) {
  module.exports.plugins.push(
    new ImageminPlugin({
      from: 'img/',
      test: /\.(png|jpe?g|gif|svg)$/i,
    })
  );
}
