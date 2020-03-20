/*
 * @Author: xuxueliang
 * @Date: 2019-12-06 11:25:39
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-20 16:53:57
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
  constructor(options) {
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
      // 处理多层级的html静态资源路径问题
      if (compiler.hooks) {
        // 添加骨架屏
        if (this.options.injectCode) {
          compilation.hooks.htmlWebpackPluginAfterHtmlProcessing && compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
            'HtmlWebpackTagPathFix',
            (data, cb) => {
              // 支持用方法去处理
              if (typeof this.options.injectCode === 'function') {
                let nhtml = this.options.injectCode(data.html)
                if (nhtml) {
                  data.html = nhtml
                }
              } else {
                data.html = data.html.replace(
                  new RegExp(`<div id=app>[ ]*</div>`),
                  `<div id=app>${ this.options.injectCode }</div>`
                )
                cb(null, data)
              }
            }
          )
        }
        if (compilation.hooks.htmlWebpackPluginAlterAssetTags) {
          compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
            // alter - asset - tags
            'HtmlWebpackTagPathFix', // <-- Set a meaningful name here for stacktraces
            mainDo
          )
        }
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
