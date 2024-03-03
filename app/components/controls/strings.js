import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  get values() {
    return this.args.value || [];
  }

  @action changed(index, value) {
    const list = this.values.slice();
    list[index] = value;
    this.args.changed(list);
  }

  @action add() {
    const list = this.values.slice();
    list.push('');
    this.args.changed(list);
  }

  @action remove(index) {
    const list = this.values.slice();
    list.removeAt(index);
    this.args.changed(list);
  }
}
