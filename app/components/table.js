import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { parseUrl as parseQuery } from 'query-string';

function getParam(url, name) {
  return parseQuery(url || '').query[name];
}

export default class extends Component {
  @computed('args.list.links.self')
  get currentPage() {
    return parseInt(getParam(this.args.list.links.self, 'page[number]') || '');
  }

  @computed('args.list.links.last')
  get lastPage() {
    return parseInt(getParam(this.args.list.links.last, 'page[number]') || '');
  }

  @computed('args.list.links.first')
  get firstCursor() {
    return getParam(this.args.list.links.first, 'page[after]');
  }

  @computed('args.list.links.prev')
  get previousCursor() {
    return getParam(this.args.list.links.prev, 'page[before]');
  }

  @computed('args.list.links.next')
  get nextCursor() {
    return getParam(this.args.list.links.next, 'page[after]');
  }

  @computed('args.list.links.last')
  get lastCursor() {
    return getParam(this.args.list.links.last, 'page[before]');
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

  @action changeCursor(kind, cursor) {
    this.args.changedCursor(kind, cursor);
  }
}
