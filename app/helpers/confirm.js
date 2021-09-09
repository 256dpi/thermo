import { helper } from '@ember/component/helper';

function confirm([msg, confirmed, declined]) {
  // check callback
  if (confirmed) {
    return function () {
      if (window.confirm(msg)) {
        confirmed();
      } else if (declined) {
        declined();
      }
    };
  }

  return async function () {
    return window.confirm(msg);
  };
}

export default helper(confirm);
