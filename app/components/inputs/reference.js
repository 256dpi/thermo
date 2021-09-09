import Component from '@glimmer/component';
import EmberObject, { action } from '@ember/object';
import { union } from '@ember/object/computed';
import { A } from '@ember/array';

export default class extends Component {
  get labelKey() {
    return this.args.labelKey || 'name';
  }

  get emptyOption() {
    return EmberObject.create({
      [this.labelKey]: this.args.emptyLabel || 'None',
    });
  }

  get emptyArray() {
    if (this.args.allowEmpty) {
      return A([this.emptyOption]);
    } else {
      return A([]);
    }
  }

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
