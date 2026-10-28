import { tracked } from '@glimmer/tracking';
import queryString from 'query-string';

function getParam(url, name) {
  return queryString.parseUrl(url || '').query[name];
}

export default class Pagination {
  @tracked list;

  constructor(list) {
    this.list = list;
  }

  /* Offset */

  get currentPage() {
    return parseInt(getParam(this.list.links?.self, 'page[number]') || '');
  }

  get lastPage() {
    return parseInt(getParam(this.list.links?.last, 'page[number]') || '');
  }

  get allPages() {
    return [...Array(this.lastPage || 0).keys()].map((i) => i + 1);
  }

  /* Cursor */

  get firstCursor() {
    return getParam(this.list.links?.first, 'page[after]');
  }

  get previousCursor() {
    return getParam(this.list.links?.prev, 'page[before]');
  }

  get nextCursor() {
    return getParam(this.list.links?.next, 'page[after]');
  }

  get lastCursor() {
    return getParam(this.list.links?.last, 'page[before]');
  }
}
