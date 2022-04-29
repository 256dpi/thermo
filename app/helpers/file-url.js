import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class FileURL extends Helper {
  @service files;

  compute([link]) {
    return this.files.url(link);
  }
}
