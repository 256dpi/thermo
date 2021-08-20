import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Controller {
  queryParams = [
    {
      sort: 's',
      filter: 'f',
      pageSize: 'ps',
      pageNumber: 'pn',
      pageBefore: 'pb',
      pageAfter: 'pa'
    }
  ];

  @tracked sort = '';
  @tracked filter = '{}';
  @tracked pageSize = 25;
  @tracked pageNumber = 0;
  @tracked pageBefore = '';
  @tracked pageAfter = '';

  get decodeFilter() {
    try {
      return JSON.parse(decodeURIComponent(this.filter));
    } catch (e) {
      return {};
    }
  }

  @action encodeFilter(filter) {
    this.filter = encodeURIComponent(JSON.stringify(filter));
  }

  @action setPageNumber(num) {
    this.pageNumber = num > 1 ? num : 0;
  }

  @action refresh() {
    this.route.refresh();
  }
}
