import { randomBytes } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function setupDockerEnvironment({
  directory = fileURLToPath(new URL('../', import.meta.url)),
  email = 'alesonroberto68@gmail.com',
  port = 3000,
} = {}) {
  if (!/^[^\s=@]+@[^\s=@]+\.[^\s=@]+$/.test(email)) throw new Error('Informe um e-mail administrativo válido.');
  if (!Number.isInteger(Number(port)) || Number(port) < 1024 || Number(port) > 65535) throw new Error('Use uma porta entre 1024 e 65535.');
  const destination = path.join(directory, '.env.docker');
  const content = [
    `APP_PORT=${Number(port)}`,
    `POSTGRES_PASSWORD=${randomBytes(24).toString('hex')}`,
    `BETTER_AUTH_SECRET=${randomBytes(48).toString('hex')}`,
    `ADMIN_EMAIL=${email.toLowerCase()}`,
    '',
  ].join('\n');
  try {
    await writeFile(destination, content, { flag: 'wx', mode: 0o600 });
    return { created: true };
  } catch (error) {
    if (error.code === 'EEXIST') return { created: false };
    throw error;
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const result = await setupDockerEnvironment({ email: process.argv[2], port: process.argv[3] });
    console.log(result.created ? '.env.docker criado com segredos locais aleatórios.' : '.env.docker já existe; seus valores foram preservados.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
