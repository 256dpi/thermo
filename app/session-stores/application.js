import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

export default class extends AdaptiveStore {
  cookieName = 'thermo-session';
  localStorageKey = 'thermo-session';
}
