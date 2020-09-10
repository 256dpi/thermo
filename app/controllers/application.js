import Controller from '@ember/controller';

export default class extends Controller {
  actions = {
    logout() {
      // invalidate session
      this.session.invalidate();
    }
  };
}
