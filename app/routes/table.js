import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { pluralize } from 'ember-inflector';

export default class extends Route.extend(AuthenticatedRouteMixin) {
  name = null;

  getConfig(name) {
    return this.blueprint.models.find((model) => model.name === name);
  }

  model(params) {
    // get previous name and config
    let name = this.name;
    let config = this.getConfig(name);

    // unsubscribe if watchable
    if (config && config.watchable) {
      this.watch.unsubscribe(pluralize(name), {});
    }

    // get new name amd config
    name = params.name;
    config = this.getConfig(params.name);

    // subscribe if watchable
    if (config && config.watchable) {
      this.watch.subscribe(pluralize(name), {});
    }

    // store name
    this.set('name', name);

    return config;
  }

  deactivate() {
    // get name and config
    const name = this.name;
    const config = this.getConfig(name);

    // unsubscribe if watchable
    if (config.watchable) {
      this.watch.unsubscribe(pluralize(name), {});
    }
  }
}
