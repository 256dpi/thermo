'use strict';

const path = require('path');

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: [path.dirname(require.resolve('normalize.css'))],
    },
    'ember-cli-babel': {
      includePolyfill: true,
    },
  });

  return app.toTree();
};
