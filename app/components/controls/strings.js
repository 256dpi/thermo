import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  @action changed(index, value) {
    const list = this.args.value.toArray();
    list[index] = value;
    this.args.changed(list);
  }

  @action add() {
    const list = this.args.value.toArray();
    list.pushObject('');
    this.args.changed(list);
  }

  @action remove(index) {
    const list = this.args.value.toArray();
    list.removeAt(index);
    this.args.changed(list);
  }
}
