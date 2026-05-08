import Component from '@glimmer/component';
import { action } from '@ember/object';
import moment from 'moment-timezone';

export default class extends Component {
  get value() {
    if (this.args.value) {
      const value = new Date(this.args.value.getTime());
      value.setSeconds(0);
      value.setMilliseconds(0);
      return moment(value).local().format(moment.HTML5_FMT.DATETIME_LOCAL);
    } else {
      return '';
    }
  }

  @action changed(e) {
    // handle cleared input
    let value;
    if (e.target.value === '') {
      value = null;
    } else {
      value = moment(
        e.target.value,
        moment.HTML5_FMT.DATETIME_LOCAL
      ).toDate();
    }

    // skip if not changed
    if (!this.value && !value) {
      return;
    }
    if (this.value && value && this.value - value === 0) {
      return;
    }

    // yield value
    this.args.changed(value);
  }

  @action clear() {
    if (this.args.value) {
      this.args.changed(null);
    }
  }

  @action now() {
    this.args.changed(new Date());
  }
}
