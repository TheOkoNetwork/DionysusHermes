import { module, test } from 'qunit';
import { setupTest } from 'dionysus/tests/helpers';

module('Unit | Route | orderSuccess', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:order-success');
    assert.ok(route);
  });
});
