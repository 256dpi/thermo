import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  config: undefined,
  list: undefined,

  pageSize: 0,
  pageNumber: 0,

  lastPage: computed('list.links', function() {
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
  }),

  actions: {
    setPageSize(size) {
      this.set('pageSize', parseInt(size));
    },

    setPageNumber(page) {
      this.set('pageNumber', page);
    },

    previousPage() {
      this.decrementProperty('pageNumber', 1);
    },

    nextPage() {
      this.incrementProperty('pageNumber', 1);
    }
  }
});
