import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

import config from 'thermo/config/environment';

export default class extends OAuth2PasswordGrant {
  clientId = config.blueprint.backend.clientID;
  serverTokenEndpoint = `${config.blueprint.backend.baseURL}/${config.blueprint.backend.authPath}/token`;
  serverTokenRevocationEndpoint = `${config.blueprint.backend.baseURL}/${config.blueprint.backend.authPath}/revoke`;
}
