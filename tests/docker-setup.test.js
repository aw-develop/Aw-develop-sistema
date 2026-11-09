import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { setupDockerEnvironment } from '../scripts/docker-setup.mjs';
const base = new URL('../.angular/docker-setup-tests/', import.meta.url);
await mkdir(base, { recursive: true });
async function directory(t) {
  const value = await mkdtemp(new URL('case-', base));
  t.after(() => rm(value, { recursive: true, force: true }));
  return value;
}
test('Docker: gera segredos diferentes por ambiente e normaliza o proprietário', async t => {
  const a = await directory(t), b = await directory(t);
  assert.equal((await setupDockerEnvironment({ directory: a, email: 'Owner@Example.com', port: 3100 })).created, true);
  await setupDockerEnvironment({ directory: b });
  const content = await readFile(a + '/.env.docker', 'utf8');
  assert.match(content, /^APP_PORT=3100$/m);
  assert.match(content, /^ADMIN_EMAIL=owner@example.com$/m);
  assert.match(content, /^POSTGRES_PASSWORD=[a-f0-9]{48}$/m);
  assert.match(content, /^BETTER_AUTH_SECRET=[a-f0-9]{96}$/m);
  assert.notEqual(content.match(/^POSTGRES_PASSWORD=(.+)$/m)[1], (await readFile(b + '/.env.docker', 'utf8')).match(/^POSTGRES_PASSWORD=(.+)$/m)[1]);
});
test('Docker: nova execução preserva credenciais e configurações existentes', async t => {
  const value = await directory(t), content = 'APP_PORT=4000\nPOSTGRES_PASSWORD=existing\n';
  await writeFile(value + '/.env.docker', content);
  assert.equal((await setupDockerEnvironment({ directory: value })).created, false);
  assert.equal(await readFile(value + '/.env.docker', 'utf8'), content);
});
test('Docker: rejeita injeção no arquivo de ambiente e portas inválidas', async t => {
  const value = await directory(t);
  for (const options of [{ email: 'x@example.com\nOTHER=value' }, { port: '3000\nOTHER=value' }, { port: 0 }, { port: 65536 }])
    await assert.rejects(setupDockerEnvironment({ directory: value, ...options }));
});
