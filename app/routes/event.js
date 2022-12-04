import Route from '@ember/routing/route';
import config from '../config/environment';
import { hash } from 'rsvp';
import moment from 'moment';
import { inject as service } from '@ember/service';

export default class eventRoute extends Route {
  @service logging;

  model(params) {
    this.logging.logtail.info('Fetching event data for event', {
      eventId: params.event_id,
    });
    const eventsPromise = fetch(`${config.OLYMPUS}/event/${params.id}`).then(
      function (response) {
        return response.json();
      }
    );
    return new hash({
      event: eventsPromise,
    })
      .then((modelData) => {
        this.logging.logtail.info('Event model data response', modelData);
        modelData.event.dateTimeUser = moment
          .unix(modelData.event.startTime)
          .format('dddd, MMMM Do YYYY, h:mm a');
        this.logging.logtail.info('Event model data', modelData);
        return modelData;
      })
      .catch((reason) => {
        this.logging.logtail.error(reason);
      });
  }
}
