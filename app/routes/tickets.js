import Route from '@ember/routing/route';
import config from '../config/environment';
import { hash } from 'rsvp';
import moment from 'moment';
import { inject as service } from '@ember/service';

export default class OrderRoute extends Route {
  @service msal;

  async model() {
    if (!this.msal.isAuthenticated) {
      return this.msal.redirectToSignIn();
    }

    console.log(`Fetching all tickets for the current user`);
    const ticketsPromise = fetch(`${config.OLYMPUS}/tickets`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.msal.idToken()}`,
      },
      method: 'GET',
    }).then(function (response) {
      return response.json();
    });

    return new hash({
      tickets: ticketsPromise,
    })
      .then((modelData) => {
        console.log('Modal data is:', modelData);
        modelData.tickets = modelData.tickets.tickets.map(function (ticket) {
          ticket.event.dateTimeUser = moment
            .unix(ticket.event.startTime)
            .format('dddd, MMMM Do YYYY, h:mm a');
          return ticket;
        });
        return modelData;
      })
      .catch((reason) => {
        console.log('rejected', reason);
      });
  }
}
