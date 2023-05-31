import { Configuration, ProvidePlugin } from 'webpack';
import { merge } from 'webpack-merge';
import grafanaConfig from './.config/webpack/webpack.config';

/**
 * Configuration
 */
const config = async (env): Promise<Configuration> => {
  const baseConfig = await grafanaConfig(env);

  /**
   * Merge
   */
  return merge(baseConfig, {
    plugins: [
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    resolve: {
      fallback: {
        buffer: require.resolve('buffer'),
      },
    },
  });
};

export default config;
