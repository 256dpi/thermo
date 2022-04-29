import Files from '@256dpi/ember-fire/services/files';

import config from 'thermo/config/environment';

export default class extends Files {
  get uploadURL() {
    if (config.blueprint.backend.uploadPath) {
      return `${config.blueprint.backend.baseURL}/${config.blueprint.backend.uploadPath}`;
    }
    return undefined;
  }

  get downloadURL() {
    if (config.blueprint.backend.downloadPath) {
      return `${config.blueprint.backend.baseURL}/${config.blueprint.backend.downloadPath}`;
    }
    return undefined;
  }
}
