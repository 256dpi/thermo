import Component from '@glimmer/component';
import EmberObject, { action, computed } from '@ember/object';
import { union } from '@ember/object/computed';
import { A } from '@ember/array';

export default class extends Component {
  get labelField() {
    return this.args.labelField || 'name';
  }

  @computed('labelField', 'args.emptyLabel')
  get emptyOption() {
    return EmberObject.create({
      [this.labelField]: this.args.emptyLabel || 'None'
    });
  }

  @computed('args.enableEmpty', 'emptyOption')
  get emptyArray() {
    if (this.args.enableEmpty) {
      return A([this.emptyOption]);
    } else {
      return A([]);
    }
  }

  @computed('args.{value.id,enableEmpty}', 'emptyOption')
  get selected() {
    // check value
    if (this.args.value === undefined && this.args.enableEmpty) {
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
