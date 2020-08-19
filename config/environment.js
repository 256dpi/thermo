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
          { name: 'deleted', kind: 'value', type: 'date' }
        ],
        properties: [
          {
            name: 'info',
            keys: ['state'],
            body: `this.get('state') ? "Active" : "Inactive"`
          }
        ],
        fields: [
          {
            name: 'name',
            title: 'Name',
            kind: 'value',
            type: 'string',
            placeholder: 'My Item'
          },
          {
            name: 'state',
            title: 'State',
            kind: 'value',
            type: 'boolean',
            default: true
          },
          {
            name: 'count',
            title: 'Count',
            kind: 'value',
            type: 'number'
          },
          {
            name: 'created',
            title: 'Created',
            kind: 'value',
            type: 'date'
          },
          {
            name: 'updated',
            title: 'Updated',
            kind: 'value',
            type: 'date'
          },
          {
            name: 'deleted',
            title: 'Deleted',
            kind: 'value',
            type: 'date'
          }
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
        fields: [
          {
            name: 'name',
            title: 'Name',
            kind: 'value',
            type: 'string'
          },
          {
            name: 'email',
            title: 'Email',
            kind: 'value',
            type: 'string'
          },
          {
            name: 'password',
            title: 'Password',
            kind: 'value',
            type: 'string',
            redacted: true
          }
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
