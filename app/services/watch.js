import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { singularize } from 'ember-inflector';
import ReconnectingWebsocket from 'reconnecting-websocket';

import config from 'thermo/config/environment';

// TODO: Remove authentication observer.

/**
 * The Watch service manages resource watching.
 */
export default class extends Service {
  @service store;
  @service session;
  @service router;

  /**
   * Returns the main watch URL for the websocket to connect to.
   *
   * @return {string|undefined}
   */
  get watchURL() {
    if (config.blueprint.backend.watchPath) {
      const baseURL = config.blueprint.backend.baseURL
        .replace('http://', 'ws://')
        .replace('https://', 'wss://');
      return `${baseURL}/${config.blueprint.backend.watchPath}`;
    }
    return undefined;
  }

  /**
   * Returns whether the watch endpoint requires authentication using an access token.
   *
   * @return {boolean}
   */
  get requireAccessToken() {
    return true;
  }

  /**
   * Is set to true if the websocket is successfully.
   *
   * @type {boolean}
   */
  @tracked connected = false;

  /**
   * The callback that is called to handle updates of dirty models.
   *
   * @param model {Model}
   */
  handleDirtyUpdate(model) {
    // ask to continue
    alert(
      'This model has been updated.\nWe will now reset it to reflect the latest changes.',
    );

    // rollback and reload
    model.rollbackAttributes();
    model.reload();
  }

  /**
   * The callback that is called to handle deletion of dirty models.
   *
   * @param model {Model}.
   */
  handleDirtyDelete(model) {
    // inform
    alert(
      'This model has been deleted.\nWe will remove it to reflect the latest changes.',
    );

    // rollback and unload
    model.rollbackAttributes();
    model.unloadRecord();

    // transition to root
    this.router.transitionTo('application');
  }

  /**
   * Subscribe will cache and issue the provided subscription.
   *
   * @param name {string}
   * @param data {Object}
   * @param replace {boolean}
   */
  subscribe(name, data = {}, replace = true) {
    // return if subscription exists and should not be replaced
    if (!replace && this.subscriptions[name]) {
      return;
    }

    // store subscription
    this.subscriptions[name] = data;

    // return if not connected
    if (!this.connected) {
      return;
    }

    // prepare command
    let cmd = {
      subscribe: {
        [name]: data,
      },
    };

    // send command
    this.websocket.send(JSON.stringify(cmd));
  }

  /**
   * Unsubscribe will unsubscribe the subscription associated with the provided key.
   *
   * @param name {string}
   */
  unsubscribe(name) {
    // delete subscription
    delete this.subscriptions[name];

    // return if not connected
    if (!this.connected) {
      return;
    }

    // prepare command
    let cmd = {
      unsubscribe: [name],
    };

    // send command
    this.websocket.send(JSON.stringify(cmd));
  }

  /* private */

  websocket = null;
  subscriptions = {};
  connectedToken = null;

  constructor() {
    super(...arguments);

    // add observer
    this.addObserver('session.isAuthenticated', this, this.initialize); // eslint-disable-line

    // initialize
    this.initialize();
  }

  willDestroy() {
    // remove observer
    this.removeObserver('session.isAuthenticated', this, this.initialize); // eslint-disable-line

    // close websocket, which would otherwise keep reconnecting and handle
    // events for a destroyed store
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      this.connectedToken = null;
    }

    super.willDestroy(...arguments);
  }

  initialize() {
    // asses whether a connection should be made
    let connect = !this.requireAccessToken || this.session.isAuthenticated;

    // handle case where we should not be connected (no authenticated)
    if (!connect) {
      // close current websocket if existing
      if (this.websocket) {
        this.websocket.close();
        this.websocket = null;
        this.connectedToken = null;
      }

      return;
    }

    // resolve token (may be null if not required)
    const token = this.requireAccessToken
      ? this.session.data.authenticated.access_token
      : null;

    // return if already connected with the same token
    if (this.websocket && this.connectedToken === token) {
      return;
    }

    // tear down stale connection (token changed)
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    // copy url
    let url = this.watchURL;

    // do not connect if url is missing
    if (!url) {
      return;
    }

    // add access token if required
    if (this.requireAccessToken) {
      url += `?access_token=${encodeURIComponent(token)}`;
    }

    // remember the token used for this connection
    this.connectedToken = token;

    // create new websocket
    this.websocket = new ReconnectingWebsocket(url, [], {
      maxReconnectionDelay: 5000,
      minReconnectionDelay: 50,
      minUptime: 5000,
      reconnectionDelayGrowFactor: 2,
      connectionTimeout: 4000,
      maxRetries: Infinity,
      debug: false,
    });

    // add connect listener
    this.websocket.addEventListener('open', () => {
      this.openHandler();
    });

    // add close listener
    this.websocket.addEventListener('close', () => {
      this.closeHandler();
    });

    // add message listener
    this.websocket.addEventListener('message', (e) => {
      this.messageHandler(JSON.parse(e.data));
    });
  }

  openHandler() {
    // set flag
    this.connected = true;

    // prepare subscription
    let cmd = {
      subscribe: {},
    };

    // add subscriptions
    Object.keys(this.subscriptions).forEach((name) => {
      cmd.subscribe[name] = this.subscriptions[name];
    });

    // send subscription
    this.websocket.send(JSON.stringify(cmd));
  }

  closeHandler() {
    // set flag
    this.connected = false;
  }

  messageHandler(data) {
    // ignore messages that arrive while being destroyed
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    // go through all models
    Object.keys(data).forEach((name) => {
      // go through all ids
      Object.keys(data[name]).forEach((id) => {
        // get singular model name
        let model = singularize(name);

        // handle event
        this.handleEvent(model, id, data[name][id]);
      });
    });
  }

  handleEvent(model, id, operation) {
    // check event operation
    switch (operation) {
      case 'created':
        this.handleCreate(model, id);
        break;
      case 'updated':
        this.handleUpdate(model, id);
        break;
      case 'deleted':
        this.handleDelete(model, id);
        break;
    }
  }

  handleCreate(model, id) {
    // load record with a small delay, unless destroyed in the meantime
    setTimeout(() => {
      if (this.isDestroying || this.isDestroyed) {
        return;
      }
      this.store.findRecord(model, id).catch(() => {});
    }, 500);
  }

  handleUpdate(model, id) {
    // get saved record
    let record = this.store.peekRecord(model, id);

    // ignore not loaded records
    if (!record) {
      return;
    }

    // do not interfere with records that are currently saving
    if (record.get('currentState.isSaving')) {
      return;
    }

    // reload immediately if not dirty
    if (!record.get('hasDirtyAttributes')) {
      record.reload().catch(() => {});
      return;
    }

    // offload dirty update handling
    this.handleDirtyUpdate(record);
  }

  handleDelete(model, id) {
    // get saved record
    let record = this.store.peekRecord(model, id);

    // ignore not loaded records
    if (!record) {
      return;
    }

    // skip if deleted
    if (record.get('isDeleted')) {
      return;
    }

    // unload immediately if not dirty
    if (!record.get('hasDirtyAttributes')) {
      record.unloadRecord();
      return;
    }

    // offload dirty delete handling
    this.handleDirtyDelete(record);
  }
}
