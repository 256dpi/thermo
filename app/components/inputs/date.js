import Component from '@ember/component';

export default class extends Component {
  label = '';
  value = null;
  hint = null;
  placeholder = null;
  disabled = false;

  get now() {
    return new Date();
  }
}
