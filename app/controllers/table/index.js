import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Controller {
  queryParams = [
    {
      sort: 's',
      filter: 'f',
      count: 'c',
      page: 'p'
    }
  ];

  @tracked sort = '';
  @tracked filter = '{}';
  @tracked count = 25;
  @tracked page = 1;

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
}
