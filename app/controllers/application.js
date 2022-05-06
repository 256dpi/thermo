import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class extends Controller {
  @service session;
  @service blueprint;
  @service user;
  @service modal;

  @action logout() {
    // invalidate session
    this.session.invalidate();
  }
}
