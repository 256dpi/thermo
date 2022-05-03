import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class extends Component {
  @service store;
  @service context;

  @action createElement() {
    if (this.args.config.itemFactory) {
      return this.context.evaluate(this.args.config.itemFactory, null);
    } else {
      return {};
    }
  }
}
