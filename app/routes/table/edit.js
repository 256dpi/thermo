import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import AutomaticRollback from '@256dpi/ember-fire/mixins/automatic-rollback';

export default Route.extend(AuthenticatedRouteMixin, AutomaticRollback, {
  model(params) {
    // get config
    let config = this.modelFor('table');

    // find record
    return this.store.find(config.name, params.id);
  },

  setupController(controller) {
    this._super(...arguments);

    // set config on controller
    controller.set('config', this.modelFor('table'));
  }
});
