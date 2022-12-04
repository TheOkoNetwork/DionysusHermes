import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class SignOutRoute extends Route {
  @service msal;
  @service logging;
  async model() {
    const msal = this.msal.msal;
    this.logging.logtail.info('Signing out');
    this.msal.signout();
    return;
  }
}
