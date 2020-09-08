import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  queryParams: [
    {
      pageSize: 'ps',
      pageNumber: 'pn'
    }
  ],

  pageSize: 25,
  pageNumber: 1,

  sorted: sort('model', 'config.sorting')
});
