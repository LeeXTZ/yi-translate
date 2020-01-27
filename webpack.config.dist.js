/* Copyright (c) 2018 Kamil Mikosz
 * Copyright (c) 2019 LeeXTZ
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT */

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {
  getHTMLPlugins,
  getOutput,
  getCopyPlugins,
  getZipPlugin,
  getFirefoxCopyPlugins,
  getEntry
} = require("./webpack.utils");
const path = require("path");
const config = require("./config.json");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const extVersion = require("./src/manifest-chrome.json").version;
const ffExtVersion = require("./src/manifest-firefox.json").version;

const generalConfig = {
  mode: "production",
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src/"),
      "webextension-polyfill": "webextension-polyfill/dist/browser-polyfill.min.js"
    }
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        query: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  firefox: 57
                }
              }
            ],
            "@babel/preset-react"
          ],
          plugins: ["transform-class-properties"]
        },
        resolve: {
          extensions: [".js", ".jsx"]
        }
      },
      {
        test: /\.(scss|css)$/,
        exclude: [path.resolve(__dirname, "src", "content")],
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        include: [path.resolve(__dirname, "src", "content")],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          "babel-loader",
          {
            loader: "react-svg-loader",
            options: {
              svgo: {
                plugins: [{ removeTitle: false }],
                floatPrecision: 2
              }
            }
          }
        ]
      }
    ]
  }
};

module.exports = [
  {
    ...generalConfig,
    output: getOutput("chrome", config.tempDirectory),
    entry: getEntry(config.chromePath),
    plugins: [
      new CleanWebpackPlugin(["dist", "temp"]),
      new UglifyJsPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name]/[name].css"
      }),
      ...getHTMLPlugins("chrome", config.tempDirectory, config.chromePath),
      ...getCopyPlugins("chrome", config.tempDirectory, config.chromePath),
      getZipPlugin(`${config.extName}-for-chrome-${extVersion}`, config.distDirectory)
    ]
  },
  {
    ...generalConfig,
    entry: getEntry(config.firefoxPath),
    output: getOutput("firefox", config.tempDirectory),
    plugins: [
      new CleanWebpackPlugin(["dist", "temp"]),
      new UglifyJsPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name]/[name].css"
      }),
      ...getHTMLPlugins("firefox", config.tempDirectory, config.firefoxPath),
      ...getFirefoxCopyPlugins("firefox", config.tempDirectory, config.firefoxPath),
      getZipPlugin(`${config.extName}-for-firefox-${ffExtVersion}`, config.distDirectory)
    ]
  },
  {
    mode: "production",
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src/")
      }
    },
    entry: { other: path.resolve(__dirname, `src/background/background.js`) },
    output: getOutput("copiedSource", config.tempDirectory),
    plugins: [
      new CopyWebpackPlugin([
        {
          from: `src`,
          to: path.resolve(__dirname, `${config.tempDirectory}/copiedSource/src/`)
        },
        {
          from: `config.json`,
          to: path.resolve(__dirname, `${config.tempDirectory}/copiedSource/config.json`)
        },
        {
          from: `LICENSE`,
          to: path.resolve(__dirname, `${config.tempDirectory}/copiedSource/LICENSE`)
        },
        {
          from: `package.json`,
          to: path.resolve(__dirname, `${config.tempDirectory}/copiedSource/package.json`)
        },
        {
          from: `README.md`,
          to: path.resolve(__dirname, `${config.tempDirectory}/copiedSource/README.md`)
        },
        {
          from: `webpack.config.dev.js`,
          to: path.resolve(__dirname, `${config.tempDirectory}/copiedSource/webpack.config.dev.js`)
        },
        {
          from: `webpack.config.dist.js`,
          to: path.resolve(__dirname, `${config.tempDirectory}/copiedSource/webpack.config.dist.js`)
        },
        {
          from: `webpack.utils.js`,
          to: path.resolve(__dirname, `${config.tempDirectory}/copiedSource/webpack.utils.js`)
        }
      ]),
      getZipPlugin(`copiedSource-${config.extName}-${ffExtVersion}`, config.distDirectory)
    ]
  }
];
