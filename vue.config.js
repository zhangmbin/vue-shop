const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports = {
  transpileDependencies: true,
  
  publicPath: './',
  lintOnSave: false, // 关闭语法检查
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:3000/', // 本地后端地址
        changeOrigin: true, //允许跨域
        ws: false
      }
    }
  }
}
