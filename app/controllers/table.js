import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class extends Controller {
  @service modal;
  @service router;

  queryParams = [
    {
      sort: 's',
      filter: 'f',
      pageSize: 'ps',
      pageNumber: 'pn',
      pageBefore: 'pb',
      pageAfter: 'pa',
    },
  ];

  @tracked sort = '';
  @tracked filter = '{}';
  @tracked pageSize = 25;
  @tracked pageNumber = 0;
  @tracked pageBefore = '';
  @tracked pageAfter = '';

  get decodeFilter() {
    try {
      return JSON.parse(decodeURIComponent(this.filter));
    } catch (e) {
      return {};
    }
  }

  @action encodeFilter(filter) {
    this.filter = encodeURIComponent(JSON.stringify(filter));
  }

  @action setPageNumber(num) {
    this.pageNumber = num > 1 ? num : 0;
  }

  @action setPageCursor(kind, cursor) {
    if (kind === 'before') {
      this.pageBefore = cursor;
      this.pageAfter = '';
    } else if (kind === 'after') {
      this.pageBefore = '';
      this.pageAfter = cursor === '*' ? '' : cursor;
    }
  }

  @action refresh() {
    this.route.refresh();
  }

  @action createItem() {
    // get config
    const config = this.config;

    // create model
    const model = this.store.createRecord(config.name);

    // initialize values
    config.attributes.forEach((attribute) => {
      if (attribute.init) {
        model.set(attribute.name, eval(attribute.init));
      }
    });

    // show modal
    this.modal.show(
      'modals/create',
      {
        config,
        model,
      },
      () => {
        this.route.refresh();
      }
    );
  }

  @action editItem(model) {
    // get config
    const config = this.config;

    // show modal
    this.modal.show(
      'modals/edit',
      {
        config,
        model,
      },
      () => {
        this.route.refresh();
      }
    );
  }
}
