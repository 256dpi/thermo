import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import ErrorHandling from '@256dpi/ember-fire/mixins/error-handling';

export default class extends Controller.extend(ErrorHandling) {
  @service blueprint;

  @tracked email = '';
  @tracked password = '';

  @action signIn() {
    this.session
      .authenticate('authenticator:oauth2', this.email, this.password, this.blueprint.backend.authScope)
      .catch((err) => {
        this.setError(err);
      });
  }
}
