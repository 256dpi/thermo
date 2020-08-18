import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    logout() {
      // invalidate session
      this.get('session').invalidate();
    }
  }
});
