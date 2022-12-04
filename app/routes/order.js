import Route from '@ember/routing/route';
import config from '../config/environment';
import { hash } from 'rsvp';
import moment from 'moment';
import { inject as service } from '@ember/service';

export default class OrderRoute extends Route {
  @service msal;
  @service logging;

  async model(params) {
    if (!this.msal.isAuthenticated) {
      return this.msal.redirectToSignIn();
    }

    this.logging.logtail.info(`Fetching order by key: ${params.key}`);
    const orderPromise = fetch(`${config.OLYMPUS}/order/${params.key}`).then(
      function (response) {
        return response.json();
      }
    );

    const orderTicketsPromise = fetch(
      `${config.OLYMPUS}/order/${params.key}/tickets`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.msal.idToken()}`,
        },
      }
    ).then(function (response) {
      return response.json();
    });
    return new hash({
      order: orderPromise,
      tickets: orderTicketsPromise,
    })
      .then((modelData) => {
        this.logging.logtail.info('Order route response', modelData);
        modelData.order = modelData.order.order;
        modelData.order.event.dateTimeUser = moment
          .unix(modelData.order.event.startTime)
          .format('dddd, MMMM Do YYYY, h:mm a');

        modelData.tickets = modelData.tickets.tickets;
        this.logging.logtail.info('Order route', modelData);
        return modelData;
      })
      .catch((reason) => {
        this.logging.logtail.error(reason);
      });
  }
}
