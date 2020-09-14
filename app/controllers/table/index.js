import Controller from '@ember/controller';

export default class extends Controller {
  queryParams = [
    {
      sort: 's',
      count: 'c',
      page: 'p'
    }
  ];

  sort = '';
  count = 25;
  page = 1;
}
