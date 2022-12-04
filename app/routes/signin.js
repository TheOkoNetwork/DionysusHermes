import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SigninRoute extends Route {
  @service msal;
  @service router;
  @service logging;

  async model() {
    const msal = this.msal.msal;
    try {
      if (msal.getAllAccounts().length > 0) {
        this.logging.logtail.info(
          'User is already signed in',
          msal.getActiveAccount()
        );
        try {
          await msal.ssoSilent();
        } catch (err) {
          this.logging.logtail.error(err);
          this.msal.signout();
        }
        this.router.transitionTo('index');
        return msal.getAllAccounts()[0];
      }
      const redirectResult = await msal.handleRedirectPromise();
      this.logging.logtail.info('signinRedirectResult', redirectResult);
      if (redirectResult && redirectResult.account) {
        this.logging.logtail.info(
          'User is freshly signed in (redirect result), setting active account'
        );
        await msal.setActiveAccount(redirectResult.account);
        this.logging.logtail.info(
          'Set active account',
          msal.getActiveAccount()
        );
        await msal.ssoSilent();
        location.href = '/';
        return;
      }

      const accounts = msal.getAllAccounts();
      if (accounts.length === 0) {
        msal.loginRedirect();
      } else {
        this.logging.logtail.info('MSAL accounts', accounts);

        this.logging.logtail.info(
          'User isnt freshly signed in, but has at least one signed in account, setting active account to first'
        );

        await msal.setActiveAccount(accounts[0]);
        location.href = '/';
        return;
      }
    } catch (error) {
      this.logging.logtail.error(error);
      location.href = '/';
    }
  }
}
