import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  label: '',
  value: null,
  hint: null,
  disabled: false,

  stringValue: computed('value', {
    get() {
      return this.value.toISOString();
    },
    set(_, value) {
      const date = new Date(Date.parse(value));
      if (!isNaN(date)) {
        this.set('value', date);
      }
      return value;
    }
  })
});
