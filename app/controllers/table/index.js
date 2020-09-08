import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: [
    {
      sort: 's',
      pageSize: 'ps',
      pageNumber: 'pn'
    }
  ],

  sort: null,
  pageSize: 25,
  pageNumber: 1
});
