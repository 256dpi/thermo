import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { singularize, pluralize } from 'ember-inflector';
import DS from 'ember-data'; // eslint-disable-line
import moment from 'moment-timezone';

const cache = {};

export default class extends Service {
  @service blueprint;
  @service store;
  @service user;

  singularize = singularize;
  pluralize = pluralize;

  moment = moment;

  promiseObject(promise) {
    return DS.PromiseObject.create({ promise });
  }

  promiseArray(promise) {
    return DS.PromiseArray.create({ promise });
  }

  evaluate(expression, object) {
    // get function
    let fn = cache[expression];
    if (!fn) {
      fn = new Function('$', expression);
      cache[expression] = fn;
    }

    // call function
    return fn.call(object, this);
  }
}
