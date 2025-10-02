import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { getError } from '@256dpi/ember-fire/utils';

function applyChangesets(array, config) {
  if (!array || !config) {
    return;
  }
  return array.map((item) => {
    let obj = {
      id: item['id'],
    };
    for (let field of config.itemFields) {
      if (field.control === 'array') {
        obj[field.key] = applyChangesets(item[field.key], field);
      } else {
        obj[field.key] = item[field.key];
      }
    }
    return obj;
  });
}

export default class extends Helper {
  @service modal;

  // TODO: Take from changeset, but apply to model?

  compute([model, config]) {
    return async () => {
      try {
        // recursively execute nested changesets
        for (let field of config.fields) {
          if (field.control === 'array') {
            model[field.key] = applyChangesets(model[field.key], field);
          }
        }

        // update model
        await model.save();

        return true;
      } catch (err) {
        // rollback model
        try {
          model.rollbackAttributes();
        } catch (e) {
          // ignore
        }

        // handle error
        this.modal.push('modals/error', {
          error: getError(err),
        });

        throw new Error('failed');
      }
    };
  }
}
