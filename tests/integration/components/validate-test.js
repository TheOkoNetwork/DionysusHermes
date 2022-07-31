import { module, test } from 'qunit';
import { setupRenderingTest } from 'dionysus/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | validate', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Validate />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Validate>
        template block text
      </Validate>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
