import { helper } from '@ember/component/helper';

function eventTargetChecked([next]) {
  return function (event) {
    next(event.target.checked);
  };
}

export default helper(eventTargetChecked);
