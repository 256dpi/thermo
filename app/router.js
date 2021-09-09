import EmberRouter from '@ember/routing/router';

import config from 'thermo/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('sign-in', function () {});

  this.route('table', { path: 'table/:name' }, function () {
    this.route('new');
    this.route('edit', { path: ':id' });
  });
});
