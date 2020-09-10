import { union } from '@ember/object/computed';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  label: '',
  value: null,
  hint: null,
  collection: null,
  disabled: false,
  multiple: false,
  enableEmpty: false,
  emptyName: 'None',
  labelField: 'name',

  emptyOption: computed('emptyName', function() {
    return EmberObject.create({ name: this.emptyName });
  }),

  emptyArray: computed('enableEmpty', 'emptyOption', function() {
    if (this.enableEmpty) {
      return A([this.emptyOption]);
    } else {
      return A([]);
    }
  }),

  selected: computed('value.id', 'enableEmpty', 'enableUnset', 'emptyOption', function() {
    let value = this.value;

    if (value === undefined && this.enableEmpty) {
      return this.emptyOption;
    }

    return this.value;
  }),

  options: union('emptyArray', 'collection'),

  actions: {
    select(value) {
      if (value === this.emptyOption) {
        this.set('value', undefined);
      } else {
        this.set('value', value);
      }
    }
  }
});
