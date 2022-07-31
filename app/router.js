import EmberRouter from '@ember/routing/router';
import config from 'dionysus/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('event', { path: 'event/:id' });
  this.route('cart');
  this.route('orderSuccess');
  this.route('cartProcessing', { path: 'cart/processing/:key' });
  this.route('orderSuccess', { path: 'order/success/:key' });
  this.route('order', { path: 'order/:key' });
  this.route('signin');
  this.route('signin', { path: 'auth' });
  this.route('signout', { path: 'auth/signout' });
  this.route('validate');
  this.route('tickets');
});
