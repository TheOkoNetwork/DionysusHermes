import { module, test } from 'qunit';
import { setupTest } from 'dionysus/tests/helpers';

module('Unit | Route | cartProcessing', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:cart-processing');
    assert.ok(route);
  });
});