import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  @action changed(value) {
    if (this.args.changed) {
      this.args.changed(value);
    }
  }
}
