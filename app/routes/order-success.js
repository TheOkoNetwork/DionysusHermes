import Route from '@ember/routing/route';
import config from '../config/environment';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default class OrderSuccessRoute extends Route {
  @service msal;
  @service logging;

  model(params) {
    if (!this.msal.isAuthenticated) {
      return this.msal.redirectToSignIn();
    }

    this.logging.logtail.info('Fetching order`, {orderKey: params.key}');
    const orderPromise = fetch(`${config.OLYMPUS}/order/${params.key}`).then(
      function (response) {
        return response.json();
      }
    );
    return new hash({
      order: orderPromise,
    })
      .then((modelData) => {
        this.logging.logtail.info('Order model data response', modelData);
        modelData.order = modelData.order.order;
        this.logging.logtail.info('Order model data', modelData);
        return modelData;
      })
      .catch((reason) => {
        this.logging.logtail.error(reason);
      });
  }
}
