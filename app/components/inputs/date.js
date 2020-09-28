import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  get now() {
    return new Date();
  }

  @action changed(dates) {
    this.args.changed(dates[0]);
  }
}
