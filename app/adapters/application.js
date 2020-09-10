import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { inject as service } from '@ember/service';

import config from 'thermo/config/environment';

export default class extends JSONAPIAdapter.extend(DataAdapterMixin) {
  @service session;

  host = config.blueprint.backend.baseURL;
  namespace = config.blueprint.backend.dataPath;

  get headers() {
    // check if authenticated
    if (this.session.isAuthenticated) {
      return {
        Authorization: `Bearer ${this.session.data.authenticated.access_token}`
      };
    }

    return {};
  }
}
