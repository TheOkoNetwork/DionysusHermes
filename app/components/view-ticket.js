import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from '../config/environment';

export default class ViewTicketComponent extends Component {
  @service msal;
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

  openGoogleWallet = async (ticketId) => {
    console.log(`Opening google wallet for ${ticketId}`);
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
        console.log('Error opening google wallet');
        this.toast.error(walletLink.message, 'Error opening google wallet');
        return;
      }
      window.open(walletLink.googleWalletLink, '_blank');
    } catch (error) {
      console.log('Network Error opening google wallet');
      this.toast.error('Network error opening google wallet');
    }
  };

  openAppleWallet = async (ticketId) => {
    console.log(`Opening apple wallet for ${ticketId}`);
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
        console.log('Error opening apple wallet');
        this.toast.error(walletLink.message, 'Error opening apple wallet');
        return;
      }
      window.open(walletLink.appleWalletLink, '_blank');
    } catch (error) {
      console.log('Network Error opening apple wallet');
      this.toast.error('Network error opening apple wallet');
    }
  };
}
