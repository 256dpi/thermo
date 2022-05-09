import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { getError } from '@256dpi/ember-fire/utils';

export default class extends Helper {
  @service modal;

  compute([model]) {
    return async () => {
      try {
        // update model
        await model.save();

        return true;
      } catch (err) {
        // handle error
        this.modal.push('modals/error', {
          error: getError(err),
        });

        throw new Error('failed');
      }
    };
  }
}
