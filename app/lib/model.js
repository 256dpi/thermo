import Model from '@ember-data/model';
import { tracked } from '@glimmer/tracking';

export default class extends Model {
  @tracked _selected = false;
}
