import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class HeaderComponent extends Component {
  @service msal;
  @service logging;

  //this is a hack to get flowbite ui components to work
  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  @action
  didInsert() {
    this.logging.logtail.info('HeaderComponent did insert');
    let ev = document.createEvent('Event');
    ev.initEvent('DOMContentLoaded', true, true);
    window.document.dispatchEvent(ev);
  }
}
