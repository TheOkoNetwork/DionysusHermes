import config from '../config/environment';
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ClaimTicketComponent extends Component {
  @service msal;
  @service router;
  @tracked name;
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
  updateName(event) {
    this.name = event.target.value;
  }
  @action
  async claim() {
    this.logging.logtail.info('Claiming ticket', {
      id: this.args.ticket.id,
      name: this.name,
    });
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
    this.logging.logtail.info('Claim ticket response', claimResult);

    if (claimResult.status) {
      this.logging.logtail.info('Ticket claimed', {
        ticketId: this.args.ticket.id,
      });
      window.alert("You've claimed the ticket!");
      this.router.refresh();
    } else {
      this.logging.logtail.info('Ticket claim failure', {
        ticketId: this.args.ticket.id,
        message: claimResult.message,
      });
      this.toast.error(claimResult.message, 'Error claiming ticket');
    }
  }
}
