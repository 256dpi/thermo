import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import AutomaticRollback from '@256dpi/ember-fire/mixins/automatic-rollback';

export default class extends Route.extend(AuthenticatedRouteMixin, AutomaticRollback) {
  model(params) {
    // get config
    const config = this.modelFor('table');

    // find record
    return this.store.find(config.name, params.id);
  }

  setupController(controller) {
    super.setupController(...arguments);

    // set config on controller
    controller.set('config', this.modelFor('table'));
  }
}
