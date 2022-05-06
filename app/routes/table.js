import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { pluralize } from 'ember-inflector';

export default class extends Route {
  @service blueprint;
  @service session;
  @service watch;

  @tracked name = null;

  queryParams = {
    sort: {
      refreshModel: true,
    },
    filter: {
      refreshModel: true,
    },
    pageSize: {
      refreshModel: true,
    },
    pageNumber: {
      refreshModel: true,
    },
    pageBefore: {
      refreshModel: true,
    },
    pageAfter: {
      refreshModel: true,
    },
  };

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

    /* load models */

    // return full list if immediate
    if (config.immediate) {
      return {
        config: config,
        model: this.store.findAll(config.name),
      };
    }

    // decode filter
    let filter;
    try {
      filter = JSON.parse(decodeURIComponent(params.filter));
    } catch (e) {
      filter = {};
    }

    // prepare query
    const query = {
      filter: filter,
      page: {
        size: params.pageSize,
      },
    };
    if (params.pageNumber !== 0) {
      query.page.number = params.pageNumber;
    }
    if (params.pageBefore !== '') {
      query.page.before = params.pageBefore;
    }
    if (params.pageAfter !== '') {
      query.page.after = params.pageAfter;
    }

    // add sorting if available
    if (params.sort) {
      query.sort = params.sort;
    }

    return {
      config,
      model: this.store.query(config.name, query),
    };
  }

  setupController(controller, data) {
    // set model
    controller.set('model', data.model);

    // set config
    controller.set('config', data.config);

    // set route on controller
    controller.set('route', this);
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
