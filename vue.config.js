const HtmlWebpackPlugin = require("html-webpack-plugin");
const StrictCspHtmlWebpackPlugin = require("strict-csp-html-webpack-plugin");
const SitemapPlugin = require("sitemap-webpack-plugin").default;

const paths = [
  {
    path: "/",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 1.0,
    changefreq: "monthly",
  },
];

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {},
      },
    },
  },
  configureWebpack: {
    plugins: [
      new StrictCspHtmlWebpackPlugin(HtmlWebpackPlugin, {
        enableUnsafeEval: true,
      }),
      new SitemapPlugin({ base: "https://www.feedgears.com", paths }),
    ],
  },
  chainWebpack: (config) => {
    // set environment variables
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_I18N_FULL_INSTALL__: JSON.stringify(true),
        __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_I18N_LEGACY_API__: JSON.stringify(false),
      })
  
      return definitions
    })
  },
});
