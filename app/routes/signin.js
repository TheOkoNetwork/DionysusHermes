import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SigninRoute extends Route {
  @service msal;
  @service router;

  async model() {
    console.log(this.msal);
    const msal = this.msal.msal;
    console.log(msal);
    try {
      if (msal.getAllAccounts().length > 0) {
        console.log('User is already signed in');
        console.log(msal.getActiveAccount());
        try {
          await msal.ssoSilent();
        } catch (err) {
          console.log(err);
          this.msal.signout();
        }
        this.router.transitionTo('index');
        return msal.getAllAccounts()[0];
      }
      const redirectResult = await msal.handleRedirectPromise();
      console.log(redirectResult);
      if (redirectResult && redirectResult.account) {
        console.log(
          'User is freshly signed in (redirect result), setting active account'
        );
        await msal.setActiveAccount(redirectResult.account);
        console.log(msal.getActiveAccount());
        await msal.ssoSilent();
        location.href = '/';
        return;
      }

      const accounts = msal.getAllAccounts();
      if (accounts.length === 0) {
        msal.loginRedirect();
      } else {
        console.log(accounts);
        console.log(
          'User isnt freshly signed in, but has at least one signed in account, setting active account to first'
        );

        await msal.setActiveAccount(accounts[0]);
        location.href = '/';
        return;
      }
    } catch (error) {
      console.log(error);
      location.href = '/';
    }
  }
}
