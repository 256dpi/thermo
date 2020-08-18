import Controller from '@ember/controller';

import ErrorHandling from '@256dpi/ember-fire/mixins/error-handling';

export default Controller.extend(ErrorHandling, {
  email: '',
  password: '',

  actions: {
    signIn() {
      this.get('session')
        .authenticate('authenticator:oauth2', this.get('email'), this.get('password'))
        .catch(err => {
          this.setError(err);
        });
    }
  }
});
