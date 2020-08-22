import Component from '@ember/component';

export default Component.extend({
  config: undefined,
  model: undefined,

  actions: {
    submit() {
      this.get('submit')();
    },

    delete() {
      this.get('delete')();
    }
  }
});
