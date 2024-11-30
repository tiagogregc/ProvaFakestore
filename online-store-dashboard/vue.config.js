// vue.config.js
module.exports = {
  publicPath: '/',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Minha Aplicação Vue';  // Título da página
      return args;
    });
  },
  devServer: {
    port: 8080,  // Certifique-se de que a porta está correta
    open: true,  // Isso deve abrir automaticamente o navegador
  },
};
