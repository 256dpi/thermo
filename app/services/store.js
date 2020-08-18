import Store from '@ember-data/store';

import FilterRecords from '@256dpi/ember-fire/mixins/filter-records';
import CustomActions from '@256dpi/ember-fire/mixins/custom-actions';

export default Store.extend(FilterRecords, CustomActions);
