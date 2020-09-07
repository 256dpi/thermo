import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  queryParams: ['page'],
  sorted: sort('model', 'config.sorting'),
  page: 1
});
