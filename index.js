/*
 * @Author: xuxueliang
 * @Date: 2019-12-06 11:25:39
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2019-12-21 13:15:31
 */
let HtmlWebpackPlugin = require('html-webpack-plugin')
function getPath (outputName) {
  return outputName
    .split('/')
    .map(() => {
      return '../'
    })
    .splice(1)
    .join('')
}
function mainDo (data, cb) {
  let assetsPublicPath =
    data.plugin.options.publicPath || getPath(data.outputName)
  data.head.forEach(v => {
    if (v.attributes) {
      v.attributes.href = assetsPublicPath + v.attributes.href
    }
  })
  data.body.forEach(v => {
    if (v.attributes) {
      if (v.attributes && v.attributes.href) {
        v.attributes.href = assetsPublicPath + v.attributes.href
      } else if (v.attributes && v.attributes.src) {
        v.attributes.src = assetsPublicPath + v.attributes.src
      }
    }
  })
  cb(null, data)
}
class HtmlWebpackTagPathFix {
  constructor (options) {
    this.options = Object.assign(
      {
        injectCode: ''
      },
      options
    )
  }
  apply (compiler) {
    if (process.env.NODE_ENV !== 'production') return
    compiler.hooks.compilation.tap('HtmlWebpackTagPathFix', compilation => {
      // console.log('The compiler is starting a new compilation...')
      // Static Plugin interface |compilation |HOOK NAME | register listener
      // 添加骨架屏
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
        'HtmlWebpackTagPathFix',
        (data, cb) => {
          // console.log('this.options.injectCode', this.options.injectCode)
          if (this.options.injectCode) {
            data.html = data.html.replace(
              '<div id=app></div>',
              `<div id=app>${this.options.injectCode}</div>`
            )
          }
          cb(null, data)
        }
      )
      // 处理多层级的html静态资源路径问题
      if (compiler.hooks) {
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
          // alter - asset - tags
          'HtmlWebpackTagPathFix', // <-- Set a meaningful name here for stacktraces
          mainDo
        )
      } else {
        //
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
          'HtmlWebpackTagPathFix', // <-- Set a meaningful name here for stacktraces
          mainDo
        )
      }
    })
  }
}

module.exports = HtmlWebpackTagPathFix
