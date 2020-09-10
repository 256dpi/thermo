import Controller from '@ember/controller';

export default class extends Controller {
  queryParams = [
    {
      sort: 's',
      pageSize: 'ps',
      pageNumber: 'pn'
    }
  ];

  sort = '';
  pageSize = 25;
  pageNumber = 1;
}
