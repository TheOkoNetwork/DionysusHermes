import Service from '@ember/service';
let msalInstance;
import * as Msal from '@azure/msal-browser';
import { inject as service } from '@ember/service';

export default class MsalService extends Service {
  @service router;

  get account() {
    return this.msal.getActiveAccount();
  }
  get isAuthenticated() {
    return Boolean(this.account);
  }
  get userEmail() {
    if (this.account) {
      return this.account.idTokenClaims.emails[0];
    }
    return null;
  }
  get userFirstName() {
    if (this.account) {
      return this.account.idTokenClaims.given_name;
    }
    return null;
  }
  get userSurname() {
    if (this.account) {
      return this.account.idTokenClaims.family_name;
    }
    return null;
  }
  get userFullName() {
    if (this.account) {
      return `${this.userFirstName} ${this.userSurname}`;
    }
    return null;
  }
  get msal() {
    if (!msalInstance) {
      msalInstance = new Msal.PublicClientApplication({
        auth: {
          clientId: '81173864-6ca0-4380-b943-63fe7e4a519f',
          authority:
            'https://okonetworkb2c.b2clogin.com/okonetworkb2c.onmicrosoft.com/B2C_1_camelotTest',
          knownAuthorities: [
            'https://okonetworkb2c.b2clogin.com/okonetworkb2c.onmicrosoft.com/B2C_1_camelotTest',
          ],
          redirectUri: 'https://map.hermes.dionysusticketing.app/auth',
          postLogoutRedirectUri: 'https://map.hermes.dionysusticketing.app/',
          navigateToLoginRequestUrl: true,
          validateAuthority: false,
          cacheLocation: 'localStorage',
        },
      });
    }
    return msalInstance;
  }
  async signout() {
    await this.msal.logoutRedirect();
  }
  redirectToSignIn() {
    localStorage.postSignInRedirectUri = window.location.href;
    return this.router.transitionTo('signin');
  }

  async idToken() {
    const account = await this.msal.getActiveAccount();
    if (account) {
      try {
        const idTokenResult = await this.msal.acquireTokenSilent({
          scopes: ['email', 'profile'],
        });
        return idTokenResult.idToken;
      } catch (error) {
        await this.signout();
      }
    }
    return null;
  }
}
