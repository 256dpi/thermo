import Component from '@glimmer/component';
import { action } from '@ember/object';
import Pagination from '@256dpi/ember-fire/pagination';

export default class extends Component {
  get pagination() {
    return new Pagination(this.args.list);
  }

  get currentPage() {
    return this.pagination.currentPage;
  }

  get lastPage() {
    return this.pagination.lastPage;
  }

  get firstCursor() {
    return this.pagination.firstCursor;
  }

  get previousCursor() {
    return this.pagination.previousCursor;
  }

  get nextCursor() {
    return this.pagination.nextCursor;
  }

  get lastCursor() {
    return this.pagination.lastCursor;
  }

  @action expand(value) {
    alert(JSON.stringify(value, null, '  '));
  }

  @action changeSort(sort) {
    // clear cursor
    this.args.changedCursor('after', undefined);
    this.args.changedCursor('before', undefined);

    // change sort
    this.args.changedSort(sort);
  }

  @action setFilter(key, value) {
    // copy filter
    const ret = {};
    for (key of Object.keys(this.args.filter)) {
      ret[key] = this.args.filter[key];
    }

    // set value
    if (value !== undefined) {
      ret[key] = value;
    } else {
      delete ret[key];
    }

    // call callback
    this.args.changedFilter(ret);
  }

  @action changeCount(size) {
    this.args.changedCount(parseInt(size));
  }

  @action changePage(current, delta = 0) {
    this.args.changedPage(current + delta);
  }

  @action changeCursor(kind, cursor) {
    this.args.changedCursor(kind, cursor);
  }

  get selected() {
    return this.args.list.filter((model) => {
      return model._selected;
    });
  }

  @action toggleAll(on) {
    // toggle model selection
    for (let model of this.args.list.toArray()) {
      model._selected = on;
    }
  }

  @action toggleModel(model, on) {
    // toggle model selection
    model._selected = on;
  }

  @action deleteSelected() {
    // delete selected models
    for (let model of this.selected.toArray()) {
      model.destroyRecord().then(() => {
        model.unloadRecord();
      });
    }
  }
}
