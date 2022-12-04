import Service from '@ember/service';
import config from '../config/environment';
import { inject as service } from '@ember/service';

export default class CartService extends Service {
  @service router;
  @service msal;
  @service logging;

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
    const cartData = await fetch(`${config.OLYMPUS}/cart/${cart.key}`).then(
      function (response) {
        return response.json();
      }
    );
    this.logging.logtail.info('refreshed cartData', {
      cart: cartData.cart,
    });
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
    this.logging.logtail.info('cartPayment', {
      cartPayment: cartPayment,
    });
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
    this.logging.logtail.info('cartOrder response', {
      cartOrder: cartOrder,
    });
    if (cartOrder.status) {
      this.logging.logtail.info('cartOrder success', {
        cartOrder: cartOrder,
      });
      if (cartOrder.status) {
        this.logging.logtail.info(
          `Redirecting to order: ${cartOrder.order.key} from cart`
        );
        this.router.transitionTo('orderSuccess', cartOrder.order.key);
        this.resetCart();
      } else {
        this.logging.logtail.error('cartOrder failed', {
          cartOrder: cartOrder,
        });
        window.location.reload();
      }
    }
  };
}
