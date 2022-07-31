import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from '../config/environment';

export default class EventController extends Controller {
  @service router;
  @service cart;
  @service toast;

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
      console.log(`Cannot add nothing to cart`);
      return;
    }
    console.log(`Adding ${this.selectedQty} to cart`);
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
    console.log(fetchRes);
    if (fetchRes.status) {
      this.cart.cart = fetchRes.cart;
      this.router.transitionTo('cart');
    } else {
      console.log(`Error adding to cart: ${fetchRes.message}`);
      this.toast.error(fetchRes.message, 'Failed adding to cart');
    }
  }
}
