import Component from '@glimmer/component';
import { action } from '@ember/object';

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export default class extends Component {
  @action changed(e) {
    if (this.args.changed) {
      this.args.changed(e.target.value);
    }
  }

  @action hexChanged(e) {
    const value = e.target.value.trim();
    if (HEX_RE.test(value)) {
      if (this.args.changed) {
        this.args.changed(value.toLowerCase());
      }
    } else {
      // restore previous value
      e.target.value = this.args.value ?? '';
    }
  }
}
