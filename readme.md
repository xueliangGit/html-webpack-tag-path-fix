# Html-webpack-tag-path-fix

[中文](./cn.md)

> Fix the problem of static files when the `'publicpath'` is a relative path on the deep level page;

The plugin depends on `'HTML webpack plugin' ^ 3.2.0 '`

Problems solved:

When a multi page application is a deep level page, for example, in the following case, when 'publicpath' is not an absolute address (relative path), the page will not find a static resource.

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

Use

```js
const htmlWebpackTagPathFix = require('Html-webpack-tag-path-fix')

// In the webpack configuration
···
plugins: [
  new htmlWebpackTagPathFix()

]
···

```

> additional

Support injection Code： injectCode

```js
new htmlWebpackTagPathFix({
  injectCode: [String || Function]
})
```

Default delivery string injection to `<div id=app></div>`Inside；

To customize; just pass one`function`accept `html` And return `html`
