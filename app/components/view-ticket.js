import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from '../config/environment';

export default class ViewTicketComponent extends Component {
  @service msal;
  @service toast;
  @service logging;

  //this is a hack to get flowbite ui components to work
  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  @action
  didInsert() {
    this.logging.logtail.info('ViewTicketComponent did insert');
    let ev = document.createEvent('Event');
    ev.initEvent('DOMContentLoaded', true, true);
    window.document.dispatchEvent(ev);
  }

  openGoogleWallet = async (ticketId) => {
    this.logging.logtail.info('Opening Google Wallet', { ticketId });
    try {
      const walletLink = await fetch(
        `${config.OLYMPUS}/tickets/${ticketId}/mobileWallet`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await this.msal.idToken()}`,
          },
          method: 'GET',
        }
      ).then(function (response) {
        return response.json();
      });
      if (!walletLink.status) {
        this.logging.logtail.info('Error opening Google Wallet', {
          ticketId,
          message: walletLink.message,
        });
        this.toast.error(walletLink.message, 'Error opening google wallet');
        return;
      }
      this.logging.logtail.info('Opening Google Wallet', {
        ticketId,
        walletLink: walletLink.walletLink,
      });
      window.open(walletLink.googleWalletLink, '_blank');
    } catch (error) {
      this.logging.logtail.error('Error opening Google Wallet', {
        ticketId,
        error,
      });
      this.toast.error('Network error opening google wallet');
    }
  };

  openAppleWallet = async (ticketId) => {
    this.logging.logtail.info('Opening Apple Wallet', { ticketId });
    try {
      const walletLink = await fetch(
        `${config.OLYMPUS}/tickets/${ticketId}/mobileWallet`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await this.msal.idToken()}`,
          },
          method: 'GET',
        }
      ).then(function (response) {
        return response.json();
      });
      this.logging.logtail.info('Opening Apple Wallet', {
        ticketId,
        walletLink: walletLink.walletLink,
      });
      if (!walletLink.status) {
        this.logging.logtail.info('Error opening Apple Wallet', {
          ticketId,
          message: walletLink.message,
        });
        this.toast.error(walletLink.message, 'Error opening apple wallet');
        return;
      }
      this.logging.logtail.info('Opening Apple Wallet', {
        ticketId,
        walletLink: walletLink.walletLink,
      });
      window.open(walletLink.appleWalletLink, '_blank');
    } catch (error) {
      this.logging.logtail.error('Error opening Apple Wallet', {
        ticketId,
        error,
      });
      this.toast.error('Network error opening apple wallet');
    }
  };
}
