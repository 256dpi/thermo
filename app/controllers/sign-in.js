import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Controller {
  @service session;
  @service router;
  @service blueprint;
  @service modal;

  @tracked email = '';
  @tracked password = '';

  @action async authenticate(e) {
    e.preventDefault();

    try {
      await this.session.authenticate(
        'authenticator:oauth2',
        this.email,
        this.password,
        this.blueprint.backend.authScope
      );
    } catch (error) {
      this.modal.push('modals/error', {
        error: error.error || error.responseJSON?.error,
      });
      return;
    }

    if (this.session.isAuthenticated) {
      this.router.transitionTo('index');
    }
  }
}
