const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FontminPlugin = require('fontmin-webpack');
// const GoogleFontsPlugin = require("google-fonts-webpack-plugin");

module.exports = {
  entry: {
    // index: './assets/scripts/index.js',
    script: ['./assets/src/scripts/scripts.js'],
    style: ['./assets/src/styles/style.scss'],
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'assets/dist')
  },
  node: {
    fs: 'empty',
    child_process: 'empty'
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}),new OptimizeCssAssetsPlugin({})],
    minimize: true,

  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              // publicPath: 'dist',
              hmr: process.env.NODE_ENV === 'development',
              // minimize: true,
              reloadAll: true,
            },
          },
          'css-loader',
          // 'postcss-loader',
          'sass-loader',
          // 'style-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
          }
        }]
      }
    ]
  },
  stats: {
    colors: true
  },
  // devtool: 'source-map',
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    // Adding our UglifyJS plugin
    // new UglifyJSPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      // filename: '[name].css',
      // chunkFilename: '[id].css',
      filename: devMode ? '[name].min.css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].min.css' : '[id].[hash].css',
      moduleFilename: ({ name }) => `${name.replace('/js/', '/css/')}.min.css`
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),
    new FontminPlugin({
      autodetect: true, // automatically pull unicode characters from CSS
      glyphs: ['\uf0c8' /* extra glyphs to include */],
    }),
    // new GoogleFontsPlugin({
    //   fonts: [
    //     { family: "Montserrat", varients: ['300'] },
    //     { family: "Raleway", varients: ['400'] }
    //   ],
    //   options: [
    //     {
    //       path: "fonts/",
    //     }
    //   ]
    // })
  ],
};