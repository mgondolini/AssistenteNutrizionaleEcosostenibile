const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../backend/public'),
  devServer: {
    proxy: 'http://localhost:8081',
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
};
