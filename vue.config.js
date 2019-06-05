const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  'lintOnSave': true,
  'outputDir': process.env.NODE_ENV === 'test' ? '../../../../Sniper-Release/2.1.2/net/webui.lingcb.com' : process.env.NODE_ENV === 'dev' ? '../../../../Sniper-Release/2.1.2/dev/webui.lingcb.com' : '../../../../Sniper-Release/2.1.2/build/webui.lingcb.com',
  'assetsDir': 'static',
  'runtimeCompiler': true,
  'productionSourceMap': true,
  'css': {
    'loaderOptions': {
      // 给 sass-loader 传递选项
      'sass': {
        'data': '@import "src/assets/sass/global.scss";'
      }
    },
    // extract: true,
    'modules': false,
    'sourceMap': false
  },
  'devServer': {
    'port': 8080,
    'open': true
  },
  'chainWebpack': config => {
    // 移除 prefetch 插件
    // config.plugins.delete('prefetch')

    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        'limit': 2048,
        'fallback': {
          'loader': 'file-loader',
          'options': {
            'name': 'static/images/[name].[ext]?[hash:8]'
          }
        }
      })
    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        'limit': 2048,
        'fallback': {
          'loader': 'file-loader',
          'options': {
            'name': 'static/fonts/[name].[ext]?[hash:8]'
          }
        }
      })
    config.module
      .rule('scss')
      .oneOf('vue-modules')
      .use('sass-loader')
      .tap(options => {
        return Object.assign(options, {
          'includePaths': [path.resolve('./node_modules/compass-mixins/lib')]
        })
      })
    config.module
      .rule('scss')
      .oneOf('normal-modules')
      .use('sass-loader')
      .tap(options => {
        return Object.assign(options, {
          'includePaths': [path.resolve('./node_modules/compass-mixins/lib')]
        })
      })
    config.module
      .rule('scss')
      .oneOf('normal')
      .use('sass-loader')
      .tap(options => {
        return Object.assign(options, {
          'includePaths': [path.resolve('./node_modules/compass-mixins/lib')]
        })
      })
    config.module
      .rule('scss')
      .oneOf('vue')
      .use('sass-loader')
      .tap(options => {
        return Object.assign(options, {
          'includePaths': [path.resolve('./node_modules/compass-mixins/lib')]
        })
      })

    if (process.env.NODE_ENV !== 'development') {
      config.optimization.splitChunks({
        'cacheGroups': {
          'vendor': {
            'test': module => {
              return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                  path.join(__dirname, 'node_modules')
                ) === 0
              )
            },
            'name': 'vendor',
            'priority': 10,
            'enforce': true,
            'chunks': 'initial'
          },
          'commons': {
            'test': /[\\/]common[\\/]|[\\/]components[\\/]/,
            'name': 'commons',
            'minChunks': 2,
            'chunks': 'all'
          }
        }
      })
      config.optimization.runtimeChunk({
        'name': 'static/js/manifest'
      })
      config.plugin('uglifyjs-webpack-plugin')
        .use(UglifyJsPlugin, [
          {
            'uglifyOptions': {
              'compress': {
                'warnings': false,
                'drop_debugger': true,
                'drop_console': true
              },
              'output': {
                'comments': false
              },
              'case': true,
              'sourceMap': false
            }
          }
        ])
      config.plugin('extract-css')
        .use(require('mini-css-extract-plugin'), [
          {
            'chunkFilename': 'static/css/[name].css?[chunkhash]'
          }
        ])
      // config.plugin('compression-webpack-plugin')
      //   .use(CompressionPlugin, [{
      //     filename: '[path].gz[query]',
      //     algorithm: 'gzip',
      //     test: new RegExp('\.(js|css)$'),
      //     threshold: 50240,
      //     minRatio: 0.8
      //   }])
    }
  },

  'configureWebpack': config => {
    Object.assign(config, {
      'output': Object.assign(config.output, {
        'chunkFilename': 'static/js/[name].js?[chunkhash]'
      }),
      'devtool': process.env.NODE_ENV !== 'development' ? false : '#cheap-module-eval-source-map'
    })
  }
}