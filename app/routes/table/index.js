import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  queryParams: {
    page: {
      refreshModel: true
    }
  },

  model(params) {
    // get config
    const config = this.modelFor('table');

    // default to first page
    params.page ||= 1;

    // TODO: Also add sorting and filters.

    // query
    return this.store.query(config.name, {
      page: {
        number: params.page,
        size: config.pageSize || 25
      }
    });
  },

  setupController(controller) {
    this._super(...arguments);

    // set config on controller
    controller.set('config', this.modelFor('table'));
  }
});
