'use strict';
const assert = require('assert');
const { validateBranding, renderShell } = require('../src/branding');
const ex = require('../themes/example-reseller.json');
let n = 0; const t = (name, fn) => { fn(); n++; console.log('ok -', name); };
t('example theme is valid', () => assert.ok(validateBranding(ex).ok));
t('defaults fill missing fields', () => {
  const v = validateBranding({ slug: 'abc' }); assert.ok(v.ok); assert.strictEqual(v.branding.primaryColor, '#2A78D6');
});
t('bad slug, color, logo, email rejected', () => {
  const v = validateBranding({ slug: 'Bad Slug', primaryColor: 'red', logoUrl: 'http://x', supportEmail: 'nope' });
  assert.strictEqual(v.errors.length, 4);
});
t('css injection in font rejected', () => assert.ok(!validateBranding({ slug: 'ab', fontFamily: 'x;}body{' }).ok));
t('shell applies reseller colors, name, logo', () => {
  const h = renderShell(ex, '<p>KPIs</p>');
  assert.ok(h.includes('--wl-primary:#1F3A93')); assert.ok(h.includes('<title>Acme Analytics</title>'));
  assert.ok(h.includes('acme-logo.png')); assert.ok(h.includes('<main><p>KPIs</p></main>'));
  assert.ok(h.includes('Powered by'));
});
t('hidePoweredBy removes badge', () => assert.ok(!renderShell({ ...ex, hidePoweredBy: true }).includes('Powered by')));
t('reseller name is HTML-escaped', () => {
  const h = renderShell({ slug: 'ab', name: '<script>x</script>' });
  assert.ok(!h.includes('<script>')); assert.ok(h.includes('&lt;script&gt;'));
});
t('invalid branding throws', () => assert.throws(() => renderShell({ slug: '' }), /Invalid branding/));
console.log(n + ' branding tests passed');
