module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      if (scopePluginIndex !== -1) {
        webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      }

      return webpackConfig;
    },
  },
};
