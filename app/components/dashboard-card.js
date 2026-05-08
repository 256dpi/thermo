import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Pagination from '@256dpi/ember-fire/pagination';

export default class extends Component {
  @service store;

  @tracked totalCount = null;
  @tracked scopeCounts = {};

  constructor() {
    super(...arguments);
    this.load();
  }

  get scopes() {
    return (this.args.config.scopes || []).map((s) => ({
      ...s,
      encoded: encodeURIComponent(JSON.stringify(s.filter || {})),
    }));
  }

  async load() {
    const config = this.args.config;

    this.count({}).then((c) => {
      this.totalCount = c;
    });

    if (config.scopes) {
      for (const scope of config.scopes) {
        this.count(scope.filter || {}).then((c) => {
          this.scopeCounts = { ...this.scopeCounts, [scope.title]: c };
        });
      }
    }
  }

  async count(filter) {
    try {
      const list = await this.store.query(this.args.config.name, {
        filter,
        page: { size: 1 },
      });
      const last = new Pagination(list).lastPage;
      if (!isNaN(last)) {
        return last;
      }
      return list.length;
    } catch (e) {
      return '–';
    }
  }
}
