import { union } from '@ember/object/computed';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  disabled: false,
  multiple: false,
  enableEmpty: false,
  enableUnset: false,
  emptyName: 'None',
  unsetName: 'Unset',
  labelField: 'name',

  emptyOption: computed('emptyName', function() {
    return EmberObject.create({ name: this.get('emptyName') });
  }),

  unsetOption: computed('unsetName', function() {
    return EmberObject.create({ name: this.get('unsetName') });
  }),

  emptyArray: computed('enableEmpty', 'emptyOption', function() {
    if (this.get('enableEmpty')) {
      return A([this.get('emptyOption')]);
    } else {
      return A([]);
    }
  }),

  unsetArray: computed('enableUnset', 'unsetOption', function() {
    if (this.get('enableUnset')) {
      return A([this.get('unsetOption')]);
    } else {
      return A([]);
    }
  }),

  selected: computed('value.id', 'enableEmpty', 'enableUnset', 'emptyOption', 'unsetOption', function() {
    let value = this.get('value');

    if (value === undefined && this.get('enableEmpty')) {
      return this.get('emptyOption');
    } else if (value === null && this.get('enableUnset')) {
      return this.get('unsetOption');
    }

    return this.get('value');
  }),

  options: union('emptyArray', 'collection', 'unsetArray'),

  actions: {
    select(value) {
      if (value === this.get('emptyOption')) {
        this.set('value', undefined);
      } else if (value === this.get('unsetOption')) {
        this.set('value', null);
      } else {
        this.set('value', value);
      }
    }
  }
});
