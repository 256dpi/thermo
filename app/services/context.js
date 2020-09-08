import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { singularize, pluralize } from 'ember-inflector';
import DS from 'ember-data'; // eslint-disable-line

export default Service.extend({
  blueprint: service(),
  store: service(),
  user: service(),

  singularize,
  pluralize,

  promiseObject(promise) {
    return DS.PromiseObject.create({ promise });
  },

  promiseArray(promise) {
    return DS.PromiseArray.create({ promise });
  }
});
