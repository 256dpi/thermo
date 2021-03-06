import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class extends Route.extend(AuthenticatedRouteMixin) {
  queryParams = {
    sort: {
      refreshModel: true
    },
    filter: {
      refreshModel: true
    },
    count: {
      refreshModel: true
    },
    page: {
      refreshModel: true
    }
  };

  model(params) {
    // get config
    const config = this.modelFor('table');

    // return full list if immediate
    if (config.immediate) {
      return this.store.findAll(config.name);
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
        size: params.count,
        number: params.page
      }
    };

    // add sorting if available
    if (params.sort) {
      query.sort = params.sort;
    }

    // query
    return this.store.query(config.name, query);
  }

  setupController(controller) {
    super.setupController(...arguments);

    // set route on controller
    controller.set('route', this);

    // set config on controller
    controller.set('config', this.modelFor('table'));
  }
}
