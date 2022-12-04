import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from '../config/environment';

export default class EventController extends Controller {
  @service router;
  @service cart;
  @service toast;
  @service logging;

  @tracked
  _selectedQty = 0;

  get selectedQty() {
    return this._selectedQty;
  }
  set selectedQty(value) {
    this._selectedQty = value;
  }
  get hasValidSelectedQty() {
    return this.selectedQty > 0;
  }
  @action
  async addToCart() {
    if (this.selectedQty <= 0) {
      this.logging.logtail.info('No quantity selected, unable to add to cart');
      return;
    }
    this.logging.logtail.info('Adding to cart', {
      selectedQty: this.selectedQty,
    });
    const fetchRes = await fetch(`${config.OLYMPUS}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qty: Number(this.selectedQty),
        event: this.model.event.id,
      }),
    }).then((response) => {
      return response.json();
    });

    this.logging.logtail.info('Add to cart response', fetchRes);
    if (fetchRes.status) {
      this.cart.cart = fetchRes.cart;
      this.logging.logtail.info('Cart updated after cart add', {
        cart: this.cart.cart,
      });
      this.router.transitionTo('cart');
    } else {
      this.logging.logtail.error('Add to cart failed', fetchRes);
      this.toast.error(fetchRes.message, 'Failed adding to cart');
    }
  }
}
