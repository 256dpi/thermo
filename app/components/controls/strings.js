import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  get values() {
    return this.args.value?.toArray() || [];
  }

  @action changed(index, value) {
    const list = this.values;
    list[index] = value;
    this.args.changed(list);
  }

  @action add() {
    const list = this.values;
    list.pushObject('');
    this.args.changed(list);
  }

  @action remove(index) {
    const list = this.values;
    list.removeAt(index);
    this.args.changed(list);
  }
}
