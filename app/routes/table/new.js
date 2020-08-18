import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import AutomaticRollback from '@256dpi/ember-fire/mixins/automatic-rollback';

export default Route.extend(AuthenticatedRouteMixin, AutomaticRollback, {
  model() {
    // get config
    let config = this.modelFor('table');

    // create record
    return this.store.createRecord(config.name);
  },

  setupController(controller) {
    this._super(...arguments);

    // set config on controller
    controller.set('config', this.modelFor('table'));
  }
});
