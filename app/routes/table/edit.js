import Route from '@ember/routing/route';

export default class extends Route {
  beforeModel(transition) {
    // check authentication
    this.session.requireAuthentication(transition, 'sign-in');
  }

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
