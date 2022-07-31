import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class HeaderComponent extends Component {
  @service msal;

  //this is a hack to get flowbite ui components to work
  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  @action
  didInsert() {
    console.log('HeaderComponent didInsert');
    let ev = document.createEvent('Event');
    ev.initEvent('DOMContentLoaded', true, true);
    window.document.dispatchEvent(ev);
  }
}
