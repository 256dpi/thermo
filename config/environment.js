'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'thermo',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.blueprint = {
    title: 'Example',
    backend: {
      baseURL: 'http://0.0.0.0:8000',
      authPath: 'auth',
      dataPath: 'api',
      watchPath: 'api/watch',
      clientID: 'main-key'
    },
    models: [
      {
        name: 'item',
        title: 'Item',
        sorting: ['name:asc'],
        watchable: true,
        attributes: [
          { name: 'name', kind: 'value', type: 'string' },
          { name: 'state', kind: 'value', type: 'boolean', default: true },
          { name: 'count', kind: 'value', type: 'number' },
          { name: 'created', kind: 'value', type: 'date' },
          { name: 'updated', kind: 'value', type: 'date' },
          { name: 'deleted', kind: 'value', type: 'date' },
          { name: 'create-token', kind: 'value', type: 'string', init: 'Date.now().toString()' },
          { name: 'update-token', kind: 'value', type: 'string' }
        ],
        properties: [
          {
            name: 'info',
            keys: ['state'],
            body: `this.get('state') ? "Active" : "Inactive"`
          }
        ],
        columns: [
          { title: 'Name', key: 'name' },
          { title: 'State', key: 'state', format: 'boolean' },
          { title: 'Count', key: 'count' },
          { title: 'Created', key: 'created', format: 'date' },
          { title: 'Updated', key: 'updated', format: 'date' },
          { title: 'Deleted', key: 'deleted', format: 'date' }
        ],
        fields: [
          { label: 'Name', key: 'name', control: 'string', placeholder: 'My Item' },
          { label: 'State', key: 'state', control: 'boolean' },
          { label: 'Count', key: 'count', control: 'number' },
        ]
      },
      {
        name: 'user',
        title: 'User',
        sorting: ['name:asc'],
        watchable: false,
        attributes: [
          { name: 'name', kind: 'value', type: 'string' },
          { name: 'email', kind: 'value', type: 'string' },
          { name: 'password', kind: 'value', type: 'string' }
        ],
        properties: [],
        columns: [
          { title: 'Name', key: 'name' },
          { title: 'Email', key: 'email' }
        ],
        fields: [
          { label: 'Name', key: 'name', control: 'string' },
          { label: 'Email', key: 'email', control: 'string' },
          { label: 'Password', key: 'password', control: 'string', redacted: true }
        ]
      }
    ]
  };

  ENV['ember-simple-auth'] = {
    authenticationRoute: 'sign-in'
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
