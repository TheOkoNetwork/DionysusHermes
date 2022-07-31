import Route from '@ember/routing/route';
import config from '../config/environment';
import { hash } from 'rsvp';
import moment from 'moment';
import { inject as service } from '@ember/service';
export default class IndexRoute extends Route {
  @service router;
  model() {
    if (!localStorage.showIndex) {
      return this.router.transitionTo('tickets');
    }
    const eventsPromise = fetch(`${config.OLYMPUS}/event`).then(function (
      response
    ) {
      return response.json();
    });
    return new hash({
      events: eventsPromise,
    })
      .then((modelData) => {
        console.log('Modal data is:', modelData);
        for (const [index, event] of modelData.events.entries()) {
          event.dateTimeUser = moment
            .unix(event.startTime)
            .format('dddd, MMMM Do YYYY, h:mm a');
          modelData.events[index] = event;
        }
        return modelData;
      })
      .catch((reason) => {
        console.log('rejected', reason);
      });
  }
}
