module.exports = {
  configureWebpack:{
    resolve:{
      alias:{
        // @默认指src
        'assets':'@/assets',
        'common':'@/common',
        'components':'@/components',
        'network':'@/network',
        'views':'@/views',
      }
    }
  }
}