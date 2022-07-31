import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class OrderController extends Controller {
  @action
  refreshRoute() {
    this.refresh();
  }
}
