import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

const cache = {};

export default class Evaluate extends Helper {
  @service context;

  compute([expression, object]) {
    // get function
    let fn = cache[expression];
    if (!fn) {
      fn = new Function('$', expression);
      cache[expression] = fn;
    }

    // call function
    return fn.call(object, this.context);
  }
}
