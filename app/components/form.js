import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

// args: config, model, changeset, onSubmit, onDelete, onCancel
export default class extends Component {
  lockable = false;
  @tracked locked = false;

  constructor() {
    super(...arguments);

    // determine lock-ability
    if (this.args.config.fields.filter((field) => field.locked).length > 0) {
      this.lockable = true;
      this.locked = true;
    }
  }

  get dirty() {
    // determine if dirty
    return this.args.changeset.isDirty;
  }

  @action reset() {
    // rollback changes
    this.args.changeset.rollback();
  }

  @action cancel() {
    // handle unsaved new models
    if (this.args.model.isNew) {
      this.args.model.unloadRecord();
    } else if (this.dirty) {
      this.reset();
    }

    // call callback
    this.args.onCancel();
  }
}
