/* Copyright (c) 2018 Kamil Mikosz
 * Copyright (c) 2019 lyldev
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");
const path = require("path");

const getHTMLPlugins = (browserDir, outputDir = "dev", sourceDir = "src") => [
  new HtmlWebpackPlugin({
    title: "Popup",
    filename: path.resolve(__dirname, `${outputDir}/${browserDir}/popup/index.html`),
    template: `${sourceDir}/popup/index.html`,
    chunks: ["popup"]
  }),
  new HtmlWebpackPlugin({
    title: "Options",
    filename: path.resolve(__dirname, `${outputDir}/${browserDir}/options/index.html`),
    template: `${sourceDir}/options/index.html`,
    chunks: ["options"]
  })
];

const getOutput = (browserDir, outputDir = "dev") => {
  return {
    path: path.resolve(__dirname, `${outputDir}/${browserDir}`),
    filename: "[name]/[name].js"
  };
};

const getEntry = (sourceDir = "src") => {
  return {
    popup: path.resolve(__dirname, `${sourceDir}/popup/index.js`),
    options: path.resolve(__dirname, `${sourceDir}/options/index.js`),
    content: path.resolve(__dirname, `${sourceDir}/content/index.js`),
    background: path.resolve(__dirname, `${sourceDir}/background/background.js`)
  };
};

const getCopyPlugins = (browserDir, outputDir = "dev", sourceDir = "src") => [
  new CopyWebpackPlugin([
    {
      from: `${sourceDir}/icons`,
      to: path.resolve(__dirname, `${outputDir}/${browserDir}/icons`)
    },
    {
      from: `${sourceDir}/_locales`,
      to: path.resolve(__dirname, `${outputDir}/${browserDir}/_locales`)
    },
    {
      from: `${sourceDir}/manifest-chrome.json`,
      to: path.resolve(__dirname, `${outputDir}/${browserDir}/manifest.json`)
    }
  ])
];

const getFirefoxCopyPlugins = (browserDir, outputDir = "dev", sourceDir = "src") => [
  new CopyWebpackPlugin([
    {
      from: `${sourceDir}/icons`,
      to: path.resolve(__dirname, `${outputDir}/${browserDir}/icons`)
    },
    {
      from: `${sourceDir}/_locales`,
      to: path.resolve(__dirname, `${outputDir}/${browserDir}/_locales`)
    },
    {
      from: `${sourceDir}/manifest-firefox.json`,
      to: path.resolve(__dirname, `${outputDir}/${browserDir}/manifest.json`)
    }
  ])
];

const getZipPlugin = (browserDir, outputDir = "dist") =>
  new ZipPlugin({
    path: path.resolve(__dirname, `${outputDir}`),
    filename: browserDir,
    extension: "zip",
    fileOptions: {
      mtime: new Date(),
      mode: 0o100664,
      compress: true,
      forceZip64Format: false
    },
    zipOptions: {
      forceZip64Format: false
    }
  });

module.exports = {
  getHTMLPlugins,
  getOutput,
  getCopyPlugins,
  getFirefoxCopyPlugins,
  getZipPlugin,
  getEntry
};
