import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class CartRoute extends Route {
  @service router;
  @service cart;
  @service msal;
  async model() {
    await this.cart.refreshCart();
    const cart = this.cart.cart;

    cart.event.dateTimeUser = moment
      .unix(cart.event.startTime)
      .format('dddd, MMMM Do YYYY, h:mm a');
    console.log(cart);
    return {
      cart: cart,
      isAuthenticated: this.msal.isAuthenticated,
    };
  }
}
