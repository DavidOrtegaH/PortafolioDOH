import { cp, mkdir } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'assets']) {
  await cp(file, `dist/${file}`, { recursive: true });
}
