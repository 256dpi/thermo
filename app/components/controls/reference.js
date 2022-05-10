import Component from '@glimmer/component';
import EmberObject, { action } from '@ember/object';
import { A } from '@ember/array';

export default class extends Component {
  get labelKey() {
    return this.args.labelKey || 'id';
  }

  get emptyOption() {
    return EmberObject.create({
      [this.labelKey]: this.args.emptyLabel || 'None',
    });
  }

  get selected() {
    // check value
    if (this.args.value === undefined && this.args.allowEmpty) {
      return this.emptyOption;
    }

    // copy array
    if (this.args.multiple) {
      return A(this.args.value.toArray());
    }

    return this.args.value;
  }

  get options() {
    // check allow empty
    if (!this.args.allowEmpty) {
      return this.args.collection;
    }

    // prepare options
    const options = A([this.emptyOption]);
    options.pushObjects(this.args.collection.toArray());

    return options;
  }

  @action select(value) {
    // yield value
    if (this.args.changed) {
      this.args.changed(value);
    }
  }
}
