import Service from '@ember/service';
import { inject as service } from '@ember/service';
export default class DomainConfigService extends Service {
  @service logging;
  loaded = false;
  getDomainConfig() {
    const domain = window.location.hostname;
    this.logging.logtail.info('DomainConfigService.getDomainConfig', {
      domain,
    });
  }
}
