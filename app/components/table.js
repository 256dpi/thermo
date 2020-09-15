import Component from '@glimmer/component';
import { action, computed } from '@ember/object';

export default class extends Component {
  @computed('args.list.links')
  get lastPage() {
    // check list
    if (!this.args.list) {
      return 0;
    }

    // get links
    let links = this.args.list.links;
    if (!links.last) {
      return 0;
    }

    // get query parameters
    let qps = links.last.split('?')[1].split('&');

    // iterate through them
    for (let qp of qps) {
      // get segments
      let s = qp.split('=');

      // check for last page number
      if (s[0] === 'page[number]') {
        return parseInt(s[1]);
      }
    }

    return 0;
  }

  @action expand(value) {
    alert(JSON.stringify(value, null, '  '));
  }

  @action changeSort(sort) {
    this.args.changedSort(sort);
  }

  @action setFilter(key, value) {
    // copy filter
    const ret = {};
    for (key in this.args.filter) {
      if (this.args.filter.hasOwnProperty(key)) {
        ret[key] = this.args.filter[key];
      }
    }

    // set value
    if (value !== undefined) {
      ret[key] = value;
    } else {
      delete ret[key];
    }

    // call callback
    this.args.changedFilter(ret);
  }

  @action changeCount(size) {
    this.args.changedCount(parseInt(size));
  }

  @action changePage(current, delta = 0) {
    this.args.changedPage(current + delta);
  }
}
