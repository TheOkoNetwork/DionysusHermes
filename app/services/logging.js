import Service from '@ember/service';
import { Logtail } from '@logtail/browser';

export default class LoggingService extends Service {
  //@TODO Store in ENV variable
  logtail = new Logtail('QynEu5Tf2mihyNjj51LLZ3MZ');
}
