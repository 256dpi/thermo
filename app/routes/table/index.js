import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  queryParams: {
    pageSize: {
      refreshModel: true
    },
    pageNumber: {
      refreshModel: true
    }
  },

  model(params) {
    // get config
    const config = this.modelFor('table');

    // TODO: Also add sorting and filters.

    // query
    return this.store.query(config.name, {
      page: {
        size: params.pageSize,
        number: params.pageNumber
      }
    });
  },

  setupController(controller) {
    this._super(...arguments);

    // set config on controller
    controller.set('config', this.modelFor('table'));
  }
});
