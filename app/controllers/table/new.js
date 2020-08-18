import Controller from '@ember/controller';

import BasicOperations from '@256dpi/ember-fire/mixins/basic-operations';

export default Controller.extend(BasicOperations, {
  afterCreateRoute: 'table'
});
