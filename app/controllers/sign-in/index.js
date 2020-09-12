import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import ErrorHandling from '@256dpi/ember-fire/mixins/error-handling';

export default class extends Controller.extend(ErrorHandling) {
  @tracked email = '';
  @tracked password = '';

  @action signIn() {
    this.session.authenticate('authenticator:oauth2', this.email, this.password).catch(err => {
      this.setError(err);
    });
  }
}
