import config from '../config/environment';
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class HeaderComponent extends Component {
  @service msal;
  @service router;
  @tracked email;
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
  updateEmail(event) {
    this.email = event.target.value;
  }
  @action
  async transfer() {
    console.log(
      `Transfering ticket: ${this.args.ticket.id} to email ${this.email}`
    );
    const transferResult = await fetch(
      `${config.OLYMPUS}/tickets/${this.args.ticket.id}/transfer`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.msal.idToken()}`,
        },
        method: 'POST',
        body: JSON.stringify({
          email: this.email,
        }),
      }
    ).then(function (response) {
      return response.json();
    });
    console.log(transferResult);
    if (transferResult.status) {
      console.log('Transfered ticket');
      window.alert(
        `You've successfully transfered this ticket, to claim this ticket ${this.email} needs to open Dionysus and click "My tickets"`
      );
      console.log(this.args);
      this.router.refresh();
    } else {
      console.log('Failed to transfer ticket');
      this.toast.error(transferResult.message, 'Error transferring ticket');
    }
  }
}
