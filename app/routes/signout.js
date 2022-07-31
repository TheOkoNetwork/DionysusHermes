import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class SignOutRoute extends Route {
  @service msal;
  async model() {
    console.log(this.msal);
    const msal = this.msal.msal;
    console.log(msal);
    this.msal.signout();
    return;
  }
}
