import 'dotenv/config';
import { getPool } from '../server/db.js';
import { contentSchema } from '../server/content-schema.js';
import { restoreMotionReference } from '../server/motion-reference.js';

const pool = getPool();
const client = await pool.connect();
const action = 'restore-motion-reference-v8';
try {
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(3909033)');
  const applied = await client.query('SELECT id FROM aw_activity WHERE action=$1 LIMIT 1', [action]);
  if (!applied.rowCount) {
    const { rows: [row] } = await client.query('SELECT * FROM aw_content WHERE id=1 FOR UPDATE');
    if (!row) throw new Error('Public content is missing; restore was not applied.');
    const published = contentSchema.parse(restoreMotionReference(row.published));
    const revision = Math.max(row.revision, row.published_revision) + 1;
    const editor = process.env.ADMIN_EMAIL || 'system';
    // A complete snapshot preserves the prior public page for restoration in the panel.
    await client.query('INSERT INTO aw_publications(content,revision,editor) VALUES($1::jsonb,$2,$3)', [JSON.stringify(row.published), row.published_revision, editor]);
    // Keep any existing draft intact; the owner can review it independently in the panel.
    await client.query('UPDATE aw_content SET published=$1::jsonb,published_revision=$2,revision=$2,published_at=now(),updated_at=now() WHERE id=1', [JSON.stringify(published), revision]);
    await client.query('INSERT INTO aw_publications(content,revision,editor) VALUES($1::jsonb,$2,$3)', [JSON.stringify(published), revision, editor]);
    await client.query('INSERT INTO aw_activity(editor,action,details) VALUES($1,$2,$3::jsonb)', [editor, action, JSON.stringify({ revision, previousRevision: row.published_revision, reference: 'awdevelop-motion version 8', draftPreserved: true })]);
    console.log('Motion reference v8 published. Previous publication and draft preserved.');
  } else {
    console.log('Motion reference v8 already restored; subsequent CMS edits preserved.');
  }
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
  await pool.end();
}
