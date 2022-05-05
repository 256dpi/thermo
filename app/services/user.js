import User from '@256dpi/ember-fire/services/user';

import config from 'thermo/config/environment';

export default class extends User {
  get dataKey() {
    return config.blueprint.backend.userDataKey || 'extra.user';
  }

  get userModel() {
    return config.blueprint.backend.userModel || 'user';
  }
}
