import Route from '@ember/routing/route';
import config from '../config/environment';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default class OrderSuccessRoute extends Route {
  @service msal;

  model(params) {
    if (!this.msal.isAuthenticated) {
      return this.msal.redirectToSignIn();
    }

    console.log(`In order success, Fetching order by key: ${params.key}`);
    const orderPromise = fetch(`${config.OLYMPUS}/order/${params.key}`).then(
      function (response) {
        return response.json();
      }
    );
    return new hash({
      order: orderPromise,
    })
      .then((modelData) => {
        console.log('Modal data is:', modelData);
        modelData.order = modelData.order.order;
        return modelData;
      })
      .catch((reason) => {
        console.log('rejected', reason);
      });
  }
}
