import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  get value() {
    return JSON.stringify(this.args.value, null, '  ');
  }

  @action changed(e) {
    if (this.args.changed) {
      this.args.changed(JSON.parse(e.target.value));
    }
  }
}
