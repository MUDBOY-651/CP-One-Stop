const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:1202/',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
      '/py_api': {
        target: 'http://127.0.0.1:5001/',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/py_api': '' }
      }
    }
  }

})
