import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class CartProessingRoute extends Route {
  @service cart;
  @service router;
  async checkPaymentStatus() {
    console.log('Checking for cart payment status');
    await this.cart.refreshCart();
    const cart = this.cart.cart;
    switch (cart.paymentStatus) {
      case 'PAID':
        this.cart.redirectToOrder();
        break;
      default:
        console.log('Still not paid yet');
        later(this, this.checkPaymentStatus, 1000);
    }
  }
  beforeModel() {
    this.checkPaymentStatus();
  }
}
