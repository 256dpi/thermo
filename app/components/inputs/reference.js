import { union } from '@ember/object/computed';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import Component from '@ember/component';

export default class extends Component {
  label = '';
  value = null;
  hint = null;
  collection = null;
  disabled = false;
  multiple = false;
  enableEmpty = false;
  emptyName = 'None';
  labelField = 'name';

  @computed('emptyName')
  get emptyOption() {
    return EmberObject.create({ name: this.emptyName });
  }

  @computed('enableEmpty', 'emptyOption')
  get emptyArray() {
    if (this.enableEmpty) {
      return A([this.emptyOption]);
    } else {
      return A([]);
    }
  }

  @computed('value.id', 'enableEmpty', 'enableUnset', 'emptyOption')
  get selected() {
    // check value
    if (this.value === undefined && this.enableEmpty) {
      return this.emptyOption;
    }

    return this.value;
  }

  @union('emptyArray', 'collection')
  options;

  actions = {
    select(value) {
      if (value === this.emptyOption) {
        this.set('value', undefined);
      } else {
        this.set('value', value);
      }
    }
  };
}
