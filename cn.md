# Html-webpack-tag-path-fix

[EN](./readme.md)

> 修复深层级页面且`publicPath`为相对路径时静态文件的问题；

该插件依赖于`html-webpack-plugin "^3.2.0"

解决的问题：

多页面应用且是深层级页面时；例如下面的这种情况；在`publicPath`不是绝对地址（相对路径时）时会造成该页面找不到静态资源。

```js
···
 new HtmlWebpackPlugin(
   {
     templateParameters: function () { /* omitted long function */ },
     chunks: [
       'chunk-vendors',
       'chunk-common',
       'index/list'
     ],
     template: 'myapp/src/page/index/list/list.html',
     filename: 'index/list.html'
   }
 )

···
```

使用

```js
const htmlWebpackTagPathFix = require('Html-webpack-tag-path-fix')

// 在webpack配置中
···
plugins: [
  new htmlWebpackTagPathFix()
]
···
```

> 附加

支持 注入代码 ： injectCode

```js
new htmlWebpackTagPathFix({
  injectCode: [String || Function]
})
```

默认传递字符串注入到 `<div id=app></div>`里面；

若要使自定义；只需传递一个`function`来接受 `html` 并且返回 `html`
