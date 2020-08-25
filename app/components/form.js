import Component from '@ember/component';

export default Component.extend({
  config: undefined,
  model: undefined,

  actions: {
    submit() {
      this.submit();
    },

    delete() {
      this.delete();
    }
  }
});
