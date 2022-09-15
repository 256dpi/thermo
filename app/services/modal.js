import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class extends Service {
  @tracked modals = A([]); // [{component, data, resolve, reject}, ...]

  constructor() {
    super(...arguments);

    // add event listener
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.dismiss();
      }
    });
  }

  get component() {
    return this.modals.lastObject?.component;
  }

  get data() {
    return this.modals.lastObject?.data;
  }

  get resolve() {
    return this.modals.lastObject?.resolve;
  }

  get reject() {
    return this.modals.lastObject?.reject;
  }

  get active() {
    return !!this.modals.lastObject;
  }

  show(component, data, resolve, reject) {
    // reject all modals
    this.modals.forEach((modal) => {
      if (modal.reject) {
        modal.reject();
      }
    });

    // set modals
    this.modals = A([
      {
        component,
        data,
        resolve,
        reject,
      },
    ]);
  }

  push(component, data, resolve, reject) {
    // push modals
    this.modals.pushObject({
      component,
      data,
      resolve,
      reject,
    });
  }

  @action complete(data) {
    // pop top modals
    let modal = this.modals.popObject();

    // call resolve if present
    if (modal && modal.resolve) {
      modal.resolve(data);
    }
  }

  @action dismiss() {
    // pop top modals
    let modal = this.modals.popObject();

    // call reject if present
    if (modal && modal.reject) {
      modal.reject();
    }
  }
}
