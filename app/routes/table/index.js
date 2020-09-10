import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class extends Route.extend(AuthenticatedRouteMixin) {
  queryParams = {
    sort: {
      refreshModel: true
    },
    pageSize: {
      refreshModel: true
    },
    pageNumber: {
      refreshModel: true
    }
  };

  model(params) {
    // get config
    const config = this.modelFor('table');

    // TODO: Also add filters.

    // prepare query
    const query = {
      page: {
        size: params.pageSize,
        number: params.pageNumber
      }
    };

    // add sorting if available
    if (params.sort) {
      query.sort = params.sort;
    }

    // TODO: What happens when documents are added by watch?

    // query
    return this.store.query(config.name, query);
  }

  setupController(controller) {
    super.setupController(...arguments);

    // set config on controller
    controller.set('config', this.modelFor('table'));
  }
}
