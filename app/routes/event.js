import Route from '@ember/routing/route';
import config from '../config/environment';
import { hash } from 'rsvp';
import moment from 'moment';

export default class eventRoute extends Route {
  model(params) {
    console.log(`Fetching event: ${params.id}`);
    const eventsPromise = fetch(`${config.OLYMPUS}/event/${params.id}`).then(
      function (response) {
        return response.json();
      }
    );
    return new hash({
      event: eventsPromise,
    })
      .then((modelData) => {
        console.log('Modal data is:', modelData);
        modelData.event.dateTimeUser = moment
          .unix(modelData.event.startTime)
          .format('dddd, MMMM Do YYYY, h:mm a');
        return modelData;
      })
      .catch((reason) => {
        console.log('rejected', reason);
      });
  }
}
