import Controller from '@ember/controller';

import ErrorHandling from '@256dpi/ember-fire/mixins/error-handling';

export default Controller.extend(ErrorHandling, {
  email: '',
  password: '',

  actions: {
    signIn() {
      this.session.authenticate('authenticator:oauth2', this.email, this.password).catch(err => {
        this.setError(err);
      });
    }
  }
});
