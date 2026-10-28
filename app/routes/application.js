import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class extends Route {
  @service session;

  async beforeModel() {
    // setup session, the index and table routes require authentication
    await this.session.setup();
  }
}
