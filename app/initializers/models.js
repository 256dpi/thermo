import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { singularize } from 'ember-inflector';

import config from 'thermo/config/environment';

// TODO: Models are missing in Ember Inspector.

export default {
  name: 'models',
  initialize: function(app) {
    // prepare models
    const models = config.blueprint.models.map(model => {
      return {
        name: model.name,
        class: Model.extend(
          Object.fromEntries(
            model.attributes
              .map(attribute => {
                switch (attribute.kind) {
                  case 'value':
                    if (attribute.type) {
                      return [attribute.name, attr(attribute.type, { defaultValue: attribute.default })];
                    } else {
                      return [attribute.name, attr({ defaultValue: attribute.default })];
                    }
                  case 'belongs-to':
                    return [attribute.name, belongsTo(singularize(attribute.type))];
                  case 'has-many':
                    return [attribute.name, hasMany(singularize(attribute.type))];
                  default:
                    throw new Error('unexpected attribute type "' + attribute.type + '" for "' + attribute.name + '"');
                }
              })
              .concat(
                model.properties.map(property => {
                  return [
                    property.name,
                    computed(...property.keys, eval('(function(){ return ' + property.body + '})'))
                  ];
                })
              )
          )
        )
      };
    });

    // register models
    models.forEach(model => {
      app.register('model:' + model.name, model.class);
    });
  }
};
