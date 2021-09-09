import Component from '@glimmer/component';
import EmberObject, { action, computed } from '@ember/object';
import { union } from '@ember/object/computed';
import { A } from '@ember/array';

export default class extends Component {
  get labelKey() {
    return this.args.labelKey || 'name';
  }

  @computed('labelKey', 'args.emptyLabel')
  get emptyOption() {
    return EmberObject.create({
      [this.labelKey]: this.args.emptyLabel || 'None',
    });
  }

  @computed('args.allowEmpty', 'emptyOption')
  get emptyArray() {
    if (this.args.allowEmpty) {
      return A([this.emptyOption]);
    } else {
      return A([]);
    }
  }

  @computed('args.{value.id,allowEmpty}', 'emptyOption')
  get selected() {
    // check value
    if (this.args.value === undefined && this.args.allowEmpty) {
      return this.emptyOption;
    }

    return this.args.value;
  }

  @union('emptyArray', 'args.collection')
  options;

  @action select(value) {
    if (this.args.changed) {
      this.args.changed(value === this.emptyOption ? undefined : value);
    }
  }
}
