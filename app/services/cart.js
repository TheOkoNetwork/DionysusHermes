import Service from '@ember/service';
import config from '../config/environment';
import { inject as service } from '@ember/service';

export default class CartService extends Service {
  @service router;
  @service msal;

  _cart = {};

  get cart() {
    if (localStorage.cart && !this._cart) {
      // eslint-disable-next-line ember/no-side-effects
      this._cart = JSON.parse(localStorage.cart);
      this.refreshCart();
    }
    return this._cart;
  }
  set cart(value) {
    localStorage.cart = JSON.stringify(value);
  }
  refreshCart = async function () {
    const cart = JSON.parse(localStorage.cart);
    console.log(cart);
    const cartData = await fetch(`${config.OLYMPUS}/cart/${cart.key}`).then(
      function (response) {
        return response.json();
      }
    );
    console.log('refreshed cartData', cartData.cart);
    this._cart = cartData.cart;
  };

  resetCart = async function () {
    this._cart = {};
    localStorage.cart = JSON.stringify(this._cart);
  };

  payNow = async function () {
    const cart = this.cart;
    const cartPayment = await fetch(`${config.OLYMPUS}/cart/${cart.key}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.msal.idToken()}`,
      },
      body: JSON.stringify({}),
    }).then(function (response) {
      return response.json();
    });
    console.log('cartPayment', cartPayment);
    if (cartPayment.status) {
      window.location.href = cartPayment.url;
    }
  };

  redirectToOrder = async function () {
    const cart = this.cart;
    const cartOrder = await fetch(`${config.OLYMPUS}/cart/${cart.key}/order`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    }).then(function (response) {
      return response.json();
    });
    console.log('cartOrder', cartOrder);
    if (cartOrder.status) {
      console.log(cartOrder);
      console.log(cartOrder.order);
      if (cartOrder.status) {
        console.log(`Redirecting to order: ${cartOrder.order.key} from cart`);
        this.router.transitionTo('orderSuccess', cartOrder.order.key);
        this.resetCart();
      } else {
        window.location.reload();
      }
    }
  };
}
