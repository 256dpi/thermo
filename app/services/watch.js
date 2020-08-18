import Watch from '@256dpi/ember-fire/services/watch';

import config from 'thermo/config/environment';

function ws(str) {
  return str.replace('http://', 'ws://').replace('https://', 'wss://');
}

export default Watch.extend({
  watchURL: ws(config.blueprint.apiBaseURL) + '/api/watch'
});
