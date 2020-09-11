import Component from '@ember/component';
import { action, computed } from '@ember/object';

export default class extends Component {
  config = undefined;
  list = undefined;

  sort = '';
  pageSize = 0;
  pageNumber = 0;

  @computed('list.links')
  get lastPage() {
    // check list
    if (!this.list) {
      return 0;
    }

    // get links
    let links = this.list.links;
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

  @action setSort(sort) {
    if (sort) {
      this.set('sort', sort);
    } else {
      this.set('sort', null);
    }
  }

  @action setPageSize(size) {
    this.set('pageSize', parseInt(size));
  }

  @action setPageNumber(page) {
    this.set('pageNumber', page);
  }

  @action previousPage() {
    this.decrementProperty('pageNumber', 1);
  }

  @action nextPage() {
    this.incrementProperty('pageNumber', 1);
  }
}
