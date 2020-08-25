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
  enableUnset: false,
  emptyName: 'None',
  unsetName: 'Unset',
  labelField: 'name',

  emptyOption: computed('emptyName', function() {
    return EmberObject.create({ name: this.emptyName });
  }),

  unsetOption: computed('unsetName', function() {
    return EmberObject.create({ name: this.unsetName });
  }),

  emptyArray: computed('enableEmpty', 'emptyOption', function() {
    if (this.enableEmpty) {
      return A([this.emptyOption]);
    } else {
      return A([]);
    }
  }),

  unsetArray: computed('enableUnset', 'unsetOption', function() {
    if (this.enableUnset) {
      return A([this.unsetOption]);
    } else {
      return A([]);
    }
  }),

  selected: computed('value.id', 'enableEmpty', 'enableUnset', 'emptyOption', 'unsetOption', function() {
    let value = this.value;

    if (value === undefined && this.enableEmpty) {
      return this.emptyOption;
    } else if (value === null && this.enableUnset) {
      return this.unsetOption;
    }

    return this.value;
  }),

  options: union('emptyArray', 'collection', 'unsetArray'),

  actions: {
    select(value) {
      if (value === this.emptyOption) {
        this.set('value', undefined);
      } else if (value === this.unsetOption) {
        this.set('value', null);
      } else {
        this.set('value', value);
      }
    }
  }
});
