import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { copy } from '@ember/object/internals';
import { A } from '@ember/array';
import { Changeset } from 'ember-changeset';

export default class extends Component {
  @tracked elements = null;
  @tracked changesets = null;
  @tracked selection = null;

  constructor() {
    super(...arguments);

    // initial prepare
    this.prepare();

    // re-prepare when invalidated
    this.args.form.invalidators.push(() => {
      // reset selection
      this.selection = undefined;

      // invalidate elements
      this.elements = undefined;
    });
  }

  prepare() {
    // copy elements
    this.elements = A(copy(this.args.elements?.toArray() || [], true));

    // create changesets
    this.changesets = A(this.elements.map((element) => new Changeset(element)));
  }

  @action
  reset() {
    // re-prepare if invalidated
    if (!this.elements) {
      this.prepare();
    }
  }

  get selected() {
    // return whether element is selected
    return typeof this.selection === 'number';
  }

  get changeset() {
    // retrieve selected changeset
    if (this.selected) {
      return this.changesets[this.selection];
    } else {
      return null;
    }
  }

  @action
  add() {
    // create element
    const element = this.args.factory();

    // add element and changeset
    this.elements.pushObject(element);
    this.changesets.pushObject(new Changeset(element));

    // select element
    this.selection = this.elements.indexOf(element);

    // compile
    this.compile();
  }

  @action
  select(index) {
    // update selection
    if (index === this.selection) {
      this.selection = undefined;
    } else {
      this.selection = index;
    }
  }

  @action
  changed() {
    // compile
    this.compile();
  }

  @action
  remove() {
    // remove element and changeset
    this.elements.removeAt(this.selection);
    this.changesets.removeAt(this.selection);

    // update selection
    if (this.selection > 0) {
      this.selection--;
    } else if (this.elements.length > 0) {
      this.selection = 0;
    } else {
      this.selection = undefined;
    }

    // compile
    this.compile();
  }

  compile() {
    // execute changesets
    for (const changeset of this.changesets) {
      changeset.execute();
    }

    // yield copy
    this.args.changed(A(copy(this.elements, true)));
  }
}
