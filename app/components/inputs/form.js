import Component from '@ember/component';

export default Component.extend({
  classNames: ['hs-form'],

  actions: {
    submit() {
      this.get('submit')();
    },

    delete() {
      this.get('delete')();
    }
  }
});
