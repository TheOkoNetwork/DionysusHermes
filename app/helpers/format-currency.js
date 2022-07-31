import { helper } from '@ember/component/helper';

export default helper(function formatCurrency(positional) {
  let [amount, currency] = positional;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
});
