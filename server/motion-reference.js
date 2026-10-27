import defaults from '../dist/content-default.json' with { type: 'json' };

// Restore only the public presentation requested by the owner. Keep all other CMS fields.
export function restoreMotionReference(content) {
  const next = structuredClone(content);
  next.hero = structuredClone(defaults.hero);
  next.sections = structuredClone(defaults.sections);
  next.portfolio = structuredClone(defaults.portfolio);
  next.contact.title = defaults.contact.title;
  next.contact.description = defaults.contact.description;
  for (const [key, value] of Object.entries(defaults.blocks)) {
    if (key.startsWith('motion-')) next.blocks[key] = value;
  }
  return next;
}
