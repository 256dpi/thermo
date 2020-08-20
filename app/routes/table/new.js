import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import AutomaticRollback from '@256dpi/ember-fire/mixins/automatic-rollback';

export default Route.extend(AuthenticatedRouteMixin, AutomaticRollback, {
  model() {
    // get config
    const config = this.modelFor('table');

    // create record
    const record = this.store.createRecord(config.name);

    // initialize values
    config.attributes.forEach(attribute => {
      if (attribute.init) {
        record.set(attribute.name, eval(attribute.init));
      }
    });

    return record;
  },

  setupController(controller) {
    this._super(...arguments);

    // set config on controller
    controller.set('config', this.modelFor('table'));
  }
});
