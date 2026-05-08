import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { singularize, pluralize } from 'ember-inflector';
import DS from 'ember-data'; // eslint-disable-line
import moment from 'moment-timezone';

export default class extends Service {
  @service blueprint;
  @service store;
  @service user;
  @service modal;

  singularize = singularize;
  pluralize = pluralize;

  moment = moment;

  cache = new Map();

  promiseObject(promise) {
    return DS.PromiseObject.create({ promise });
  }

  promiseArray(promise) {
    return DS.PromiseArray.create({ promise });
  }

  evaluate(expression, object) {
    // get function
    let fn = this.cache.get(expression);
    if (!fn) {
      fn = new Function('$', expression);
      this.cache.set(expression, fn);
    }

    // call function
    return fn.call(object, this);
  }
}
