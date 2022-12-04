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
  @service logging;

  //this is a hack to get flowbite ui components to work
  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  @action
  didInsert() {
    this.logging.logtail.info('ClaimTicketComponent did insert');
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
    this.logging.logtail.info('Transfering ticket', {
      id: this.args.ticket.id,
      email: this.email,
    });
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
    this.logging.logtail.info('Transfer ticket response', transferResult);
    if (transferResult.status) {
      this.logging.logtail.info('Ticket transfered', {
        ticketId: this.args.ticket.id,
      });
      window.alert(
        `You've successfully transfered this ticket, to claim this ticket ${this.email} needs to open Dionysus and click "My tickets"`
      );
      this.router.refresh();
    } else {
      this.logging.logtail.info('Ticket transfer failure', {
        ticketId: this.args.ticket.id,
        message: transferResult.message,
      });
      this.toast.error(transferResult.message, 'Error transferring ticket');
    }
  }
}
