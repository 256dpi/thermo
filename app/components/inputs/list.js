import Component from '@ember/component';
import { isArray } from '@ember/array';
import { computed } from '@ember/object';

export default Component.extend({
  add: 'Add',
  empty: 'Empty',

  list: computed('value.*', {
    get() {
      return (this.value || []).map(str => {
        return { value: str };
      });
    },
    set(_, __, list) {
      let l = list.map(item => item.value);
      this.set('value', l);
      return list;
    }
  }),

  actions: {
    add() {
      // get list
      let list = this.list;

      // check list
      if (!isArray(list)) {
        list = [];
        this.set('list', list);
      }

      // add object
      list.pushObject({
        value: ''
      });

      this.set('list', list);
    },

    save(list) {
      this.set('list', list);
    },

    remove(index) {
      // get list
      let list = this.list;

      // remove item
      list.removeAt(index);

      // save list
      this.set('list', list);
    }
  }
});
