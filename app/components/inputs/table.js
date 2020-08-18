import Component from '@ember/component';
import { isArray } from '@ember/array';

export default Component.extend({
  add: 'Add',

  columns: [], // [{ name, field, default, placeholder }, ...]

  actions: {
    add() {
      // get list
      let list = this.get('value');

      // check list
      if (!isArray(list)) {
        list = [];
        this.set('value', list);
      }

      // prepare entry
      let entry = {};

      // set defaults
      for (let column of this.get('columns')) {
        entry[column.field] = column.default || null;
      }

      // add entry
      list.addObject(entry);
    },

    remove(index) {
      this.get('value').removeAt(index);
    }
  }
});
