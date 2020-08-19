import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';

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
                    return [attribute.name, attr(attribute.type, { defaultValue: attribute.default })];
                  case 'belongs-to':
                    return [attribute.name, belongsTo(attribute.type)];
                  case 'has-many':
                    return [attribute.name, hasMany(attribute.type)];
                  default:
                    return [attribute.name, null];
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
