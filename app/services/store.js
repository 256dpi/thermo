import Store, { CacheHandler } from '@ember-data/store';
import RequestManager from '@ember-data/request';
import { LegacyNetworkHandler } from '@ember-data/legacy-compat';

// TODO: Move to new request manager handlers.

export default class extends Store {
  requestManager = new RequestManager();

  constructor(args) {
    super(args);
    this.requestManager.use([LegacyNetworkHandler]);
    this.requestManager.useCache(CacheHandler);
  }

  /**
   * Will find multiple models using the provided filters.
   *
   * @param model {string}
   * @param filters {Object}
   * @param query {Object}
   * @return {Promise<[Model]>}
   */
  filterAll(model, filters = {}, query = {}) {
    // build a fresh object so we don't mutate the caller's query
    const merged = { ...query };
    Object.keys(filters).forEach(function (key) {
      merged['filter[' + key + ']'] = filters[key];
    });

    return this.query(model, merged);
  }

  /**
   * Will find a single model using the provided filters.
   *
   * @param model {string}
   * @param filters {Object}
   * @param query {Object}
   * @return {Promise<Model|undefined>}
   */
  async filterRecord(model, filters = {}, query = {}) {
    return (await this.filterAll(model, filters, query))[0];
  }

  /**
   * Call the specified group action.
   *
   * @param method {string}
   * @param action {string}
   * @param data {Object}
   * @return {Promise<Object>}
   */
  callGroupAction(method, action, data = {}) {
    // get adapter
    let adapter = this.adapterFor('application', action);

    // build url
    let url = `${adapter.buildURL()}/${action}`;

    // make request
    return adapter.ajax(url, method, {
      data,
    });
  }

  /**
   * Calls the specified collection action.
   *
   * @param method {string}
   * @param name {string}
   * @param action {string}
   * @param data {Object}
   * @return {Promise<Object>}
   */
  callCollectionAction(method, name, action, data = {}) {
    // get adapter
    let adapter = this.adapterFor(name, action);

    // build url
    let url = `${adapter.buildURL(name)}/${action}`;

    // make request
    return adapter.ajax(url, method, {
      data,
    });
  }

  /**
   * Calls the specified resource action.
   *
   * @param method {string}
   * @param name {string}
   * @param id {string}
   * @param action {string}
   * @param data {Object}
   * @return {Promise<Object>}
   */
  callResourceAction(method, name, id, action, data = {}) {
    // get adapter
    let adapter = this.adapterFor(name, action);

    // build url
    let url = `${adapter.buildURL(name, id)}/${action}`;

    // make request
    return adapter.ajax(url, method, {
      data,
    });
  }
}
