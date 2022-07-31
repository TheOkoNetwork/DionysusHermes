import Route from '@ember/routing/route';
import config from '../config/environment';
import { hash } from 'rsvp';
import moment from 'moment';
import { inject as service } from '@ember/service';

export default class OrderRoute extends Route {
  @service msal;

  async model(params) {
    if (!this.msal.isAuthenticated) {
      return this.msal.redirectToSignIn();
    }

    console.log(`Fetching order by key: ${params.key}`);
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
        console.log('Modal data is:', modelData);
        modelData.order = modelData.order.order;
        modelData.order.event.dateTimeUser = moment
          .unix(modelData.order.event.startTime)
          .format('dddd, MMMM Do YYYY, h:mm a');

        modelData.tickets = modelData.tickets.tickets;
        return modelData;
      })
      .catch((reason) => {
        console.log('rejected', reason);
      });
  }
}
