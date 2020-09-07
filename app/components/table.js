import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  config: undefined,
  list: undefined,
  page: 0,

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
    set(page) {
      this.set('page', page);
    },

    previous() {
      this.decrementProperty('page', 1);
    },

    next() {
      this.incrementProperty('page', 1);
    }
  }
});
