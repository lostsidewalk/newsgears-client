{
  mode: 'production',
  context: '/world/src/coldchillinsw/newsgears-client',
  devtool: 'source-map',
  output: {
    hashFunction: 'xxhash64',
    path: '/world/src/coldchillinsw/newsgears-client/dist',
    filename: 'js/[name].[contenthash:8].js',
    publicPath: '/',
    chunkFilename: 'js/[name].[contenthash:8].js'
  },
  resolve: {
    alias: {
      '@': '/world/src/coldchillinsw/newsgears-client/src',
      vue$: 'vue/dist/vue.runtime.esm-bundler.js'
    },
    extensions: [
      '.mjs',
      '.js',
      '.jsx',
      '.vue',
      '.json',
      '.wasm'
    ],
    modules: [
      'node_modules',
      '/world/src/coldchillinsw/newsgears-client/node_modules',
      '/world/src/coldchillinsw/newsgears-client/node_modules/@vue/cli-service/node_modules'
    ]
  },
  resolveLoader: {
    modules: [
      '/world/src/coldchillinsw/newsgears-client/node_modules/@vue/cli-plugin-babel/node_modules',
      'node_modules',
      '/world/src/coldchillinsw/newsgears-client/node_modules',
      '/world/src/coldchillinsw/newsgears-client/node_modules/@vue/cli-service/node_modules'
    ]
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      /* config.module.rule('esm') */
      {
        test: /\.m?jsx?$/,
        resolve: {
          fullySpecified: false
        }
      },
      /* config.module.rule('vue') */
      {
        test: /\.vue$/,
        use: [
          /* config.module.rule('vue').use('vue-loader') */
          {
            loader: '/world/src/coldchillinsw/newsgears-client/node_modules/vue-loader/dist/index.js',
            options: {
              cacheDirectory: '/world/src/coldchillinsw/newsgears-client/node_modules/.cache/vue-loader',
              cacheIdentifier: '397e4cb6',
              babelParserPlugins: [
                'jsx',
                'classProperties',
                'decorators-legacy'
              ]
            }
          }
        ]
      },
      /* config.module.rule('vue-style') */
      {
        test: /\.vue$/,
        resourceQuery: /type=style/,
        sideEffects: true
      },
      /* config.module.rule('pug') */
      {
        test: /\.pug$/,
        oneOf: [
          /* config.module.rule('pug').oneOf('pug-vue') */
          {
            resourceQuery: /vue/,
            use: [
              /* config.module.rule('pug').oneOf('pug-vue').use('pug-plain-loader') */
              {
                loader: 'pug-plain-loader'
              }
            ]
          },
          /* config.module.rule('pug').oneOf('pug-template') */
          {
            use: [
              /* config.module.rule('pug').oneOf('pug-template').use('raw') */
              {
                loader: 'raw-loader'
              },
              /* config.module.rule('pug').oneOf('pug-template').use('pug-plain-loader') */
              {
                loader: 'pug-plain-loader'
              }
            ]
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.(svg)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext]'
        }
      },
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'img/[name].[hash:8][ext]'
        }
      },
      /* config.module.rule('media') */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'media/[name].[hash:8][ext]'
        }
      },
      /* config.module.rule('fonts') */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        oneOf: [
          /* config.module.rule('css').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('css').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('css').oneOf('vue-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('css').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('css').oneOf('vue').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('css').oneOf('vue').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('css').oneOf('vue').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('css').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('css').oneOf('normal-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('css').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('normal') */
          {
            use: [
              /* config.module.rule('css').oneOf('normal').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('css').oneOf('normal').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('css').oneOf('normal').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('postcss') */
      {
        test: /\.p(ost)?css$/,
        oneOf: [
          /* config.module.rule('postcss').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('postcss').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('postcss').oneOf('vue-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('postcss').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('postcss').oneOf('vue').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('postcss').oneOf('vue').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('postcss').oneOf('vue').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('postcss').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('postcss').oneOf('normal-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('postcss').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('normal') */
          {
            use: [
              /* config.module.rule('postcss').oneOf('normal').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('postcss').oneOf('normal').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('postcss').oneOf('normal').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('scss') */
      {
        test: /\.scss$/,
        oneOf: [
          /* config.module.rule('scss').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('scss').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('scss').oneOf('vue-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('scss').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('scss').oneOf('vue-modules').use('sass-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/sass-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {}
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('scss').oneOf('vue').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('scss').oneOf('vue').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('scss').oneOf('vue').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('scss').oneOf('vue').use('sass-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/sass-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {}
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('scss').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('scss').oneOf('normal-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('scss').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('scss').oneOf('normal-modules').use('sass-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/sass-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {}
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('normal') */
          {
            use: [
              /* config.module.rule('scss').oneOf('normal').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('scss').oneOf('normal').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('scss').oneOf('normal').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('scss').oneOf('normal').use('sass-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/sass-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {}
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('sass') */
      {
        test: /\.sass$/,
        oneOf: [
          /* config.module.rule('sass').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('sass').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('sass').oneOf('vue-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('sass').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('sass').oneOf('vue-modules').use('sass-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/sass-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('sass').oneOf('vue').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('sass').oneOf('vue').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('sass').oneOf('vue').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('sass').oneOf('vue').use('sass-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/sass-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('sass').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('sass').oneOf('normal-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('sass').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('sass').oneOf('normal-modules').use('sass-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/sass-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('normal') */
          {
            use: [
              /* config.module.rule('sass').oneOf('normal').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('sass').oneOf('normal').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('sass').oneOf('normal').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('sass').oneOf('normal').use('sass-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/sass-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('less') */
      {
        test: /\.less$/,
        oneOf: [
          /* config.module.rule('less').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('less').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('less').oneOf('vue-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('less').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('less').oneOf('vue-modules').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('less').oneOf('vue').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('less').oneOf('vue').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('less').oneOf('vue').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('less').oneOf('vue').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('less').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('less').oneOf('normal-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('less').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('less').oneOf('normal-modules').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('normal') */
          {
            use: [
              /* config.module.rule('less').oneOf('normal').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('less').oneOf('normal').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('less').oneOf('normal').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('less').oneOf('normal').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('stylus') */
      {
        test: /\.styl(us)?$/,
        oneOf: [
          /* config.module.rule('stylus').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('stylus').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('stylus').oneOf('vue-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('stylus').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('stylus').oneOf('vue-modules').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('stylus').oneOf('vue').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('stylus').oneOf('vue').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('stylus').oneOf('vue').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('stylus').oneOf('vue').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('stylus').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('stylus').oneOf('normal-modules').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('stylus').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('stylus').oneOf('normal-modules').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('normal') */
          {
            use: [
              /* config.module.rule('stylus').oneOf('normal').use('extract-css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/mini-css-extract-plugin/dist/loader.js',
                options: {
                  publicPath: '/'
                }
              },
              /* config.module.rule('stylus').oneOf('normal').use('css-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/css-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('stylus').oneOf('normal').use('postcss-loader') */
              {
                loader: '/world/src/coldchillinsw/newsgears-client/node_modules/postcss-loader/dist/cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('stylus').oneOf('normal').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('js') */
      {
        test: /\.m?jsx?$/,
        exclude: [
          function () { /* omitted long function */ }
        ],
        use: [
          /* config.module.rule('js').use('thread-loader') */
          {
            loader: '/world/src/coldchillinsw/newsgears-client/node_modules/thread-loader/dist/cjs.js'
          },
          /* config.module.rule('js').use('babel-loader') */
          {
            loader: '/world/src/coldchillinsw/newsgears-client/node_modules/babel-loader/lib/index.js',
            options: {
              cacheCompression: false,
              cacheDirectory: '/world/src/coldchillinsw/newsgears-client/node_modules/.cache/babel-loader',
              cacheIdentifier: '3e2a3046'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    realContentHash: false,
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      /* config.optimization.minimizer('terser') */
      new TerserPlugin(
        {
          terserOptions: {
            compress: {
              arrows: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              booleans: true,
              if_return: true,
              sequences: true,
              unused: true,
              conditionals: true,
              dead_code: true,
              evaluate: true
            },
            mangle: {
              safari10: true
            }
          },
          parallel: true,
          extractComments: false
        }
      ),
      /* config.optimization.minimizer('css') */
      new CssMinimizerPlugin(
        {
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                mergeLonghand: false,
                cssDeclarationSorter: false
              }
            ]
          }
        }
      )
    ]
  },
  plugins: [
    /* config.plugin('vue-loader') */
    new VueLoaderPlugin(),
    /* config.plugin('feature-flags') */
    new DefinePlugin(
      {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false'
      }
    ),
    /* config.plugin('define') */
    new DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"production"',
          BASE_URL: '"/"'
        }
      }
    ),
    /* config.plugin('case-sensitive-paths') */
    new CaseSensitivePathsPlugin(),
    /* config.plugin('friendly-errors') */
    new FriendlyErrorsWebpackPlugin(
      {
        additionalTransformers: [
          function () { /* omitted long function */ }
        ],
        additionalFormatters: [
          function () { /* omitted long function */ }
        ]
      }
    ),
    /* config.plugin('extract-css') */
    new MiniCssExtractPlugin(
      {
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css'
      }
    ),
    /* config.plugin('html') */
    new HtmlWebpackPlugin(
      {
        title: 'FeedGears RSS',
        scriptLoading: 'defer',
        templateParameters: function () { /* omitted long function */ },
        template: '/world/src/coldchillinsw/newsgears-client/public/index.html'
      }
    ),
    /* config.plugin('pwa') */
    new HtmlPwaPlugin(
      {
        name: 'FeedGears RSS',
        manifestOptions: {
          name: 'NewsGears',
          short_name: 'NewsGears',
          description: 'NewsGears',
          theme_color: '#2196f3',
          background_color: '#2196f3',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'bender.png',
              sizes: '144x144'
            },
            {
              src: 'bender_maskable.png',
              sizes: '192x192',
              purpose: 'maskable'
            },
            {
              src: 'bender_splash.png',
              sizes: '512x512'
            }
          ]
        }
      }
    ),
    /* config.plugin('copy') */
    new CopyPlugin(
      {
        patterns: [
          {
            from: '/world/src/coldchillinsw/newsgears-client/public',
            to: '/world/src/coldchillinsw/newsgears-client/dist',
            toType: 'dir',
            noErrorOnMissing: true,
            globOptions: {
              ignore: [
                '**/.DS_Store',
                '/world/src/coldchillinsw/newsgears-client/public/index.html'
              ]
            },
            info: {
              minimized: true
            }
          }
        ]
      }
    ),
    /* config.plugin('eslint') */
    new ESLintWebpackPlugin(
      {
        extensions: [
          '.js',
          '.jsx',
          '.vue'
        ],
        cwd: '/world/src/coldchillinsw/newsgears-client',
        cache: true,
        cacheLocation: '/world/src/coldchillinsw/newsgears-client/node_modules/.cache/eslint/6d60b5b2.json',
        context: '/world/src/coldchillinsw/newsgears-client',
        failOnWarning: false,
        failOnError: true,
        eslintPath: '/world/src/coldchillinsw/newsgears-client/node_modules/eslint',
        formatter: 'stylish'
      }
    ),
    /* config.plugin('workbox') */
    new GenerateSW(
      {
        exclude: [
          /\.map$/,
          /img\/icons\//,
          /favicon\.ico$/,
          /^manifest.*\.js?$/
        ],
        cacheId: 'FeedGears'
      }
    ),
    {
      htmlWebpackPlugin: function () { /* omitted long function */ },
      options: {
        enabled: true,
        enableTrustedTypes: false
      }
    }
  ],
  entry: {
    app: [
      './src/main.js'
    ]
  }
}
