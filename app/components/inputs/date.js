import Component from '@glimmer/component';

export default class extends Component {
  get now() {
    return new Date();
  }
}
