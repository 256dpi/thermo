import { helper } from '@ember/component/helper';

import { getError } from '@256dpi/ember-fire/utils';

function saveModel([model]) {
  return async () => {
    try {
      // update model
      await model.save();

      return true;
    } catch (err) {
      // handle error
      alert(getError(err));

      throw new Error('failed');
    }
  };
}

export default helper(saveModel);
