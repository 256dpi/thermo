import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

// args: config, model, changeset, onSubmit, onDelete, onCancel, onAbandon
export default class extends Component {
  @service router;

  lockable = false;
  @tracked locked = false;

  passThrough = false;

  constructor() {
    super(...arguments);

    // add listener for route change
    this.router.on('routeWillChange', this, 'routeWillChange');

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

  @action
  reset() {
    // rollback changes
    this.args.changeset.rollback();
  }

  @action
  cancel() {
    // handle unsaved new models
    if (this.args.model.isNew) {
      this.args.model.unloadRecord();
      this.passThrough = true;
    } else if (this.dirty) {
      this.reset();
    }

    // call callback
    this.args.onCancel();
  }

  routeWillChange(transition) {
    // check pass through
    if (this.passThrough) {
      return;
    }

    // ignore aborted transitions
    if (transition.isAborted) {
      return;
    }

    // ignore deleted models
    if (this.args.model.isDeleted) {
      return;
    }

    // handle unsaved new models
    if (this.args.model.isNew) {
      // unload model if not set
      if (!this.args.onAbandon) {
        this.args.model.unloadRecord();
        return;
      }

      // otherwise abort transition
      transition.abort();

      // call abandon callback
      this.args.onAbandon().then((ok) => {
        if (ok) {
          // unload model and retry transition with pass through
          this.args.model.unloadRecord();
          this.passThrough = true;
          transition.retry();
        }
      });

      return;
    }

    // handle unsaved changed models
    if (this.dirty) {
      // reset model if not set
      if (!this.args.onAbandon) {
        this.reset();
        return;
      }

      // otherwise abort transition
      transition.abort();

      // call abandon callback
      this.args.onAbandon().then((ok) => {
        if (ok) {
          // rollback model and retry transition with pass through
          this.reset();
          this.passThrough = true;
          transition.retry();
        }
      });
    }
  }

  willDestroy() {
    super.willDestroy();

    // remove listener for route change
    this.router.off('routeWillChange', this, 'routeWillChange');
  }
}
