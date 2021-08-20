import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { parseUrl as parseQuery } from 'query-string';

function getParam(url, name) {
  return parseQuery(url).query[name];
}

export default class extends Component {
  @computed('args.list.links.self')
  get currentPage() {
    // get number from self link
    return parseInt(getParam(this.args.list.links.self, 'page[number]') || '');
  }

  @computed('args.list.links.last')
  get lastPage() {
    // get number from last link
    return parseInt(getParam(this.args.list.links.last, 'page[number]') || '');
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
    for (key of Object.keys(this.args.filter)) {
      ret[key] = this.args.filter[key];
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
