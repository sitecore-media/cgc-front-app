import { JssConfig } from 'lib/config';
import { ConfigPlugin } from '..';

/**
 * This config will set fallback values for properties that were left empty
 * If neither env, nor other places had a proper value, this will ensure a fallback is set
 */
class FallbackPlugin implements ConfigPlugin {
  // should always come last
  order = 100;

  async exec(config: JssConfig) {
    return Object.assign({}, config, {
      defaultLanguage: config.defaultLanguage || 'en',
            layoutServiceConfigurationName: config.layoutServiceConfigurationName || 'default',
          });
  }
}

export const fallbackPlugin = new FallbackPlugin();
