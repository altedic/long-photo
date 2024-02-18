const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  // 添加代理配置
  devServer: {
    host: '0.0.0.0',
    port: 8081,
    allowedHosts: 'all',
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
