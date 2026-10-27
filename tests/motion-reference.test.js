import test from 'node:test';
import assert from 'node:assert/strict';
import { restoreMotionReference } from '../server/motion-reference.js';
import defaults from '../dist/content-default.json' with { type: 'json' };

test('Reference restoration brings back the opening and original section order without changing contact channels or branding', () => {
  const current = structuredClone(defaults);
  current.sections = [{ id: 'conexoes', type: 'builtin' }];
  current.hero.title = 'O Seu Negócio';
  current.contact.email = 'equipe@example.com';
  current.contact.whatsapp = '5511999999999';
  current.settings.logo = 'assets/custom-logo.svg';
  current.blocks['custom-heading'] = 'Draft-safe content';
  const restored = restoreMotionReference(current);
  assert.deepEqual(restored.sections, defaults.sections);
  assert.deepEqual(restored.hero, defaults.hero);
  assert.deepEqual(restored.settings, current.settings);
  assert.equal(restored.contact.email, current.contact.email);
  assert.equal(restored.contact.whatsapp, current.contact.whatsapp);
  assert.equal(restored.blocks['custom-heading'], current.blocks['custom-heading']);
  assert.equal(current.hero.title, 'O Seu Negócio');
  assert.deepEqual(restoreMotionReference(restored), restored);
});
