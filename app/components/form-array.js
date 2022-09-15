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
      return this.args.array.objectAt(this.selection);
    } else {
      return null;
    }
  }

  @action add() {
    // add new item to array
    this.args.array.addObject(this.args.factory());

    // update selection
    this.selection = this.args.array.length - 1;
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
    this.args.array.removeAt(this.selection);

    // update selection
    if (this.selection > 0) {
      this.selection--;
    } else if (this.args.array.length > 0) {
      this.selection = 0;
    } else {
      this.selection = undefined;
    }
  }
}
