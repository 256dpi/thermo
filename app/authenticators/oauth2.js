import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

import config from 'thermo/config/environment';

export default OAuth2PasswordGrant.extend({
  clientId: config.blueprint.clientID,
  serverTokenEndpoint: config.blueprint.apiBaseURL + '/' + config.blueprint.authNamespace + '/token',
  serverTokenRevocationEndpoint: config.blueprint.apiBaseURL + '/' + config.blueprint.authNamespace + '/revoke'
});
