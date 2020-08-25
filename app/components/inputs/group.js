import Component from '@ember/component';

export default Component.extend({
  selected: null,

  actions: {
    add() {
      let num = this.models.length;
      this.models.addObject(this.factory(num + 1));
    },

    select(model) {
      if (model === this.selected) {
        this.set('selected', null);
      } else {
        this.set('selected', model);
      }
    },

    remove(model) {
      // get models
      let models = this.models;

      // remove model
      models.removeAt(models.indexOf(model));

      // check if empty
      if (models.length === 0) {
        this.set('selected', null);
        return;
      }

      // otherwise select first
      this.set('selected', models.get(0));
    }
  }
});
