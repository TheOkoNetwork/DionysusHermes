import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class ApplicationRoute extends Route {
  @service logging;
  @service domainConfig;
  async model() {
    this.logging.logtail.info('Hermes application bootup');
    await this.domainConfig.getDomainConfig();
    
    return {
      domainConfig: this.domainConfig,
    };
  }
}
