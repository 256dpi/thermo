import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    // get config
    const config = this.modelFor('table');

    // find all
    return this.store.findAll(config.name);
  },

  setupController(controller) {
    this._super(...arguments);

    // set config on controller
    controller.set('config', this.modelFor('table'));
  }
});
