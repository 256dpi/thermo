import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  get now() {
    return new Date();
  }

  get value() {
    if (this.args.value) {
      const value = new Date(this.args.value.getTime());
      value.setSeconds(0);
      value.setMilliseconds(0);
      return value;
    } else {
      return undefined;
    }
  }

  @action changed(dates) {
    // skip if not changed
    if (this.value && dates[0] && this.value - dates[0] === 0) {
      return;
    }

    this.args.changed(dates[0]);
  }
}
