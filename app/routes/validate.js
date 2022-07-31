import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class ValidateRoute extends Route {
  @service msal;
  model() {
    if (!this.msal.isAuthenticated) {
      return this.msal.redirectToSignIn();
    }
  }
}
