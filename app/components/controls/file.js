import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { action } from '@ember/object';

export default class extends Component {
  @service files;
  @service modal;

  get values() {
    if (this.args.multiple) {
      return this.args.value;
    } else if (this.args.value) {
      return A([this.args.value]);
    } else {
      return A([]);
    }
  }

  @action async add(file) {
    let link = await this.files.upload(file);
    if (this.args.multiple) {
      this.args.changed([...this.values, link]);
    } else {
      this.args.changed(link);
    }
  }

  @action remove(file) {
    if (this.args.multiple) {
      this.args.changed(this.values.filter((f) => f !== file));
    } else {
      this.args.changed(null);
    }
  }

  @action preview(file) {
    this.modal.push('modals/preview', {
      file: file,
    });
  }
}
