import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked selection = null;

  constructor() {
    super(...arguments);

    // unset select when invalidated
    this.args.form.invalidators.push(() => {
      this.selection = undefined;
    });
  }

  get item() {
    // retrieve selected item
    if (typeof this.selection === 'number') {
      return this.args.items.objectAt(this.selection);
    } else {
      return null;
    }
  }

  @action add() {
    // add new item
    this.args.items.addObject(this.args.factory());

    // update selection
    this.selection = this.args.items.length - 1;
  }

  @action select(index) {
    // update selection
    if (index === this.selection) {
      this.selection = undefined;
    } else {
      this.selection = index;
    }
  }

  @action remove() {
    // remove item
    this.args.items.removeAt(this.selection);

    // update selection
    if (this.selection > 0) {
      this.selection--;
    } else if (this.args.items.length > 0) {
      this.selection = 0;
    } else {
      this.selection = undefined;
    }
  }
}
