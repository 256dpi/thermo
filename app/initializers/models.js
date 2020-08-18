import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

import config from 'thermo/config/environment';

export default {
  name: 'models',
  initialize: function(app) {
    // prepare models
    const models = config.blueprint.models.map(model => {
      return {
        name: model.name,
        class: Model.extend(
          Object.fromEntries(
            model.fields.map(field => {
              switch (field.kind) {
                case 'value':
                  return [field.name, attr(field.type)];
                case 'belongs-to':
                  return [field.name, belongsTo(field.type)];
                case 'has-many':
                  return [field.name, hasMany(field.type)];
                default:
                  return [field.name, attr()];
              }
            })
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
