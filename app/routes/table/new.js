import Route from '@ember/routing/route';

export default class extends Route {
  beforeModel(transition) {
    // check authentication
    this.session.requireAuthentication(transition, 'sign-in');
  }

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
