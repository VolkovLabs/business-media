const webpack = require("webpack");

module.exports.getWebpackConfig = (config, options) => ({
    ...config,
    plugins: [
        ...config.plugins,
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    resolve: {
      ...config.resolve,
      fallback: {
        "buffer": require.resolve("buffer")
      },
    },
  });