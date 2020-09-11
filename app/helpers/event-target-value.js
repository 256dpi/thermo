import { helper } from '@ember/component/helper';

function eventTargetValue([next]) {
  return function(event) {
    next(event.target.value);
  };
}

export default helper(eventTargetValue);
