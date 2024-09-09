'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // 页面标题

// 如果端口设置为80，请使用管理员权限执行命令行。
// 例如，Mac: sudo npm run修改端口的方法如下:
// port = 9000 npm run dev
// 或
// npm run dev——port = 9000
const port = process.env.port || process.env.npm_config_port || 9000 // dev port

// 所有配置项说明请参考 https://cli.vuejs.org/config/
module.exports = {
  /**
   * 如果在子路径下部署站点，例如GitHub Pages，则需要设置publicPath
   * 如果将站点部署到 https://foo.github.io/bar/，那么publicPath应该设置为 "/bar/"
   * 在大多数情况下请使用'/'
   * 详细请参考: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // 在webpack的name字段中提供应用的标题，这样就可以在index.html中访问它以注入正确的标题
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // 可以提高首屏（用户在浏览器中首次看到的页面部分）加载速度，建议开启预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // 忽略 runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 当页面很多的时候，会产生太多无意义的请求
    config.plugins.delete('prefetch')

    // 设置 svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime`必须与 runtimeChunk 名称相同。默认为`runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 只打包最初依赖的第三方
                },
                elementUI: {
                  name: 'chunk-elementUI', // 将elementUI拆分为一个包
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应 cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // 可以自定义规则
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
