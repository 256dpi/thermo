import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class Evaluate extends Helper {
  @service context;

  compute([expression, object]) {
    return this.context.evaluate(expression, object);
  }
}
