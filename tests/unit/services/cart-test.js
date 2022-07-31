import { module, test } from 'qunit';
import { setupTest } from 'dionysus/tests/helpers';

module('Unit | Service | cart', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:cart');
    assert.ok(service);
  });
});
