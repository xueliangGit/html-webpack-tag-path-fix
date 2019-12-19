/*
 * @Author: xuxueliang
 * @Date: 2019-12-06 11:25:39
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2019-12-19 19:52:14
 */
let HtmlWebpackPlugin = require('html-webpack-plugin')
function getPath (outputName) {
  return outputName.split('/').map(() => {
    return '../'
  }).splice(1).join('')
}
function mainDo (data, cb) {
  let assetsPublicPath = data.plugin.options.publicPath || getPath(data.outputName)
  data.head.forEach(v => {
    v.attributes.href = assetsPublicPath + v.attributes.href
  })
  data.body.forEach(v => {
    if (v.attributes.href) {
      v.attributes.href = assetsPublicPath + v.attributes.href
    } else if (v.attributes.src) {
      v.attributes.src = assetsPublicPath + v.attributes.src
    }
  })
  cb(null, data)
}
class HtmlWebpackTagPathFix {
  constructor (options) {
    this.options = Object.assign({
      injectCode: ''
    }, options)
  }
  apply (compiler) {
    if (process.env.NODE_ENV !== 'production') return
    compiler.hooks.compilation.tap('HtmlWebpackTagPathFix', (compilation) => {
      // 处理多层级的html静态资源路径问题
      if (compiler.hooks) {
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync( // alter - asset - tags
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
