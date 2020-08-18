import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import config from 'thermo/config/environment';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  session: service(),

  host: config.blueprint.backend.baseURL,
  namespace: config.blueprint.backend.dataPath,

  headers: computed('session.data.authenticated.access_token', function() {
    let headers = {};
    if (this.get('session.isAuthenticated')) {
      headers['Authorization'] = `Bearer ${this.get('session.data.authenticated.access_token')}`;
    }

    return headers;
  })
});
