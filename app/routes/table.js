import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { pluralize } from 'ember-inflector';

export default class extends Route {
  @service blueprint;
  @service session;
  @service watch;

  @tracked name = null;

  beforeModel(transition) {
    // check authentication
    this.session.requireAuthentication(transition, 'sign-in');
  }

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
    this.name = name;

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
