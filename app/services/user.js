import Service, { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { cached } from '@glimmer/tracking';
import { jwtDecode } from 'jwt-decode';

import config from 'thermo/config/environment';

/**
 * The User service loads the model of the currently authenticated user.
 */
export default class extends Service {
  @service store;
  @service session;

  /**
   * The key used in the data object of the token claim to store the user id.
   *
   * @return {string}
   */
  get dataKey() {
    return config.blueprint.backend.userDataKey || 'extra.user';
  }

  /**
   * The name of the model that should be loaded.
   *
   * @return {string}
   */
  get userModel() {
    return config.blueprint.backend.userModel || 'user';
  }

  /**
   * The data read from the access token.
   *
   * @return {Object|null}
   */
  get data() {
    // check authentication
    if (!this.session.isAuthenticated) {
      return null;
    }

    // get access token
    let data = jwtDecode(this.session.data.authenticated.access_token);

    return data['dat'];
  }

  /**
   * Returns the user id from the data object of the token claim.
   *
   * @returns {string|undefined}
   */
  get id() {
    const data = this.data;
    return data ? get(data, this.dataKey) : undefined;
  }

  /**
   * The user model retrieved from the access token.
   *
   * @return {Promise<Model|undefined>}
   */
  @cached get model() {
    // check existence
    if (!this.data) {
      return undefined;
    }

    // find user
    return this.store.findRecord(this.userModel, this.id);
  }
}
