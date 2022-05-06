import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class Confirm extends Helper {
  @service modal;

  compute([msg, confirmed, declined]) {
    // check callback
    if (confirmed) {
      return () => {
        this.modal.push(
          'modals/confirm',
          {
            text: msg,
          },
          confirmed,
          declined
        );
      };
    }

    return new Promise((resolve, reject) => {
      this.modal.push(
        'modals/confirm',
        {
          text: msg,
        },
        resolve,
        reject
      );
    });
  }
}
