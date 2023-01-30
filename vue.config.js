const HtmlWebpackPlugin = require('html-webpack-plugin');
const StrictCspHtmlWebpackPlugin = require('strict-csp-html-webpack-plugin');

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new StrictCspHtmlWebpackPlugin(HtmlWebpackPlugin, {
        enableUnsafeEval: true,
      }),
    ],
  },
});
