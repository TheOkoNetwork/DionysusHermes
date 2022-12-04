import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class CartProessingRoute extends Route {
  @service cart;
  @service router;
  @service logging;

  async checkPaymentStatus() {
    this.logging.logtail.info('Checking payment status');
    await this.cart.refreshCart();
    const cart = this.cart.cart;
    switch (cart.paymentStatus) {
      case 'PAID':
        this.logging.logtail.info('Cart now paid');
        this.cart.redirectToOrder();
        break;
      default:
        this.logging.logtail.info('Cart not paid yet');
        later(this, this.checkPaymentStatus, 1000);
    }
  }
  beforeModel() {
    this.checkPaymentStatus();
  }
}
