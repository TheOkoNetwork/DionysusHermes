import config from '../config/environment';
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class HeaderComponent extends Component {
  @service msal;
  @service router;
  @tracked name;
  @service toast;

  //this is a hack to get flowbite ui components to work
  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  @action
  didInsert() {
    console.log('ClaimTicketComponent didInsert');
    let ev = document.createEvent('Event');
    ev.initEvent('DOMContentLoaded', true, true);
    window.document.dispatchEvent(ev);
  }

  @action
  updateName(event) {
    this.name = event.target.value;
  }
  @action
  async claim() {
    console.log(`Claiming ticket: ${this.args.ticket.id} for ${this.name}`);
    const claimResult = await fetch(
      `${config.OLYMPUS}/tickets/${this.args.ticket.id}/claim`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.msal.idToken()}`,
        },
        method: 'POST',
        body: JSON.stringify({
          name: this.name,
        }),
      }
    ).then(function (response) {
      return response.json();
    });
    console.log(claimResult);
    if (claimResult.status) {
      console.log('Claimed ticket');
      window.alert("You've claimed the ticket!");
      console.log(this.args);
      this.router.refresh();
    } else {
      console.log('Failed to claim ticket');
      this.toast.error(claimResult.message, 'Error claiming ticket');
    }
  }
}
