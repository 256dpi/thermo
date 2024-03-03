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
    // convert local datetime string
    const value = moment(
      e.target.value,
      moment.HTML5_FMT.DATETIME_LOCAL
    ).toDate();

    // skip if not changed
    if (this.value && value && this.value - value === 0) {
      return;
    }

    // yield value
    this.args.changed(value);
  }
}
