import { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { singularize } from 'ember-inflector';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

import Model from 'thermo/lib/model';
import config from 'thermo/config/environment';

function copy(value) {
  // check value
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value));
}

export default {
  async initialize(app) {
    // load remote blueprint if available
    if (config.blueprint.remote) {
      // defer readiness
      app.deferReadiness();

      // load blueprint
      const res = await fetch(config.blueprint.remote);
      config.blueprint = await res.json();

      // advanced readiness
      app.advanceReadiness();
    }

    // ensure lists
    for (const model of config.blueprint.models) {
      for (const key of ['attributes', 'properties', 'orders', 'filters', 'columns', 'actions', 'fields']) {
        model[key] ||= [];
      }
    }

    // build reverse inverse map
    const reverseInverses = {};
    config.blueprint.models.forEach((model) => {
      model.attributes.forEach((attribute) => {
        if (attribute.kind === 'has-many' && attribute.inverse) {
          reverseInverses[`${singularize(attribute.type)}#${attribute.inverse}`] = attribute.name;
        }
      });
    });

    // prepare models
    const models = config.blueprint.models.map((model) => {
      // build header
      const header = [['context', service()]];

      // build attributes
      const attributes = model.attributes.map((attribute) => {
        switch (attribute.kind) {
          case 'value': {
            if (attribute.type) {
              return [
                attribute.name,
                attr(attribute.type, {
                  defaultValue() {
                    return copy(attribute.default, true);
                  },
                }),
              ];
            } else {
              return [
                attribute.name,
                attr({
                  defaultValue() {
                    return copy(attribute.default, true);
                  },
                }),
              ];
            }
          }
          case 'belongs-to': {
            const belongsToOptions = { inverse: null };
            if (attribute.inverse) {
              belongsToOptions['inverse'] = attribute.inverse;
            } else {
              const reverseInverse = reverseInverses[`${model.name}#${attribute.name}`];
              if (reverseInverse) {
                belongsToOptions['inverse'] = reverseInverse;
              }
            }
            return [attribute.name, belongsTo(singularize(attribute.type), belongsToOptions)];
          }
          case 'has-many': {
            const hasManyOptions = { inverse: null };
            if (attribute.inverse) {
              hasManyOptions['inverse'] = attribute.inverse;
            } else {
              const reverseInverse = reverseInverses[`${model.name}#${attribute.name}`];
              if (reverseInverse) {
                hasManyOptions['inverse'] = reverseInverse;
              }
            }
            return [attribute.name, hasMany(singularize(attribute.type), hasManyOptions)];
          }
          case 'file':
            return [attribute.name, attr('file-link')];
          case 'files':
            return [attribute.name, attr('file-links')];
          default:
            throw new Error('unexpected attribute type "' + attribute.type + '" for "' + attribute.name + '"');
        }
      });

      // build properties
      const properties = model.properties.map((property) => {
        const fn = new Function('$', property.body);
        return [
          property.name,
          computed('context', ...property.keys, function () {
            return fn.call(this, this.context);
          }),
        ];
      });

      return {
        name: model.name,
        class: Model.extend(Object.fromEntries(header.concat(attributes, properties))),
      };
    });

    // register models
    models.forEach((model) => {
      app.register('model:' + model.name, model.class);
    });
  },
};
