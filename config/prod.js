module.exports = {
  mode: 'production',
  env: {
    // NODE_ENV: '"production"',
    HTTP_URL: '"https://getman.cn/mock"'
  },
  defineConstants: {
    HTTP_URL: '"https://aiot.aciga.com.cn/alita"',
    HTTP_COM_URL: '"https://visitorgw.lingdong.cn"', // 社区
    CLIENT_ID: '"17300da5-e672-440b-8f65-b99aee7c96cb"'
  },
  mini: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  }
};
