import Watch from '@256dpi/ember-fire/services/watch';

import config from 'thermo/config/environment';

export default class extends Watch {
  get watchURL() {
    if (config.blueprint.backend.watchPath) {
      const baseURL = config.blueprint.backend.baseURL.replace('http://', 'ws://').replace('https://', 'wss://');
      return `${baseURL}/${config.blueprint.backend.watchPath}`;
    }
    return undefined;
  }
}
