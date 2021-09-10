import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class extends Route {
  @service session;

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
