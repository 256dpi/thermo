import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class Transition extends Helper {
  @service router;

  compute([route, ...params]) {
    return (...moreParams) => {
      // build transition
      const args = params.concat(moreParams);
      const transition = params.length ? [route, ...params] : [route];

      // perform transition
      this.router.transitionTo(...transition);

      return args;
    };
  }
}
