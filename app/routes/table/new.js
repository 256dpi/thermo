import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class extends Route.extend(AuthenticatedRouteMixin) {
  model() {
    // get config
    const config = this.modelFor('table');

    // create record
    const record = this.store.createRecord(config.name);

    // initialize values
    config.attributes.forEach((attribute) => {
      if (attribute.init) {
        record.set(attribute.name, eval(attribute.init));
      }
    });

    return record;
  }

  setupController(controller) {
    super.setupController(...arguments);

    // set config on controller
    controller.set('config', this.modelFor('table'));
  }
}
