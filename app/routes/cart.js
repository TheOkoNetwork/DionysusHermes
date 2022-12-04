import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class CartRoute extends Route {
  @service router;
  @service cart;
  @service msal;
  @service logging;

  async model() {
    this.logging.logtail.info('Fetching cart');
    await this.cart.refreshCart();
    const cart = this.cart.cart;

    cart.event.dateTimeUser = moment
      .unix(cart.event.startTime)
      .format('dddd, MMMM Do YYYY, h:mm a');
    const modalData = {
      cart: cart,
      isAuthenticated: this.msal.isAuthenticated,
    };
    this.logging.logtail.info('Cart model data', modalData);

    return modalData;
  }
}
