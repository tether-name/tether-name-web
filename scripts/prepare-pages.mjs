import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const indexHtml = resolve(distDir, 'index.html');

// Routes we want as real static documents (HTTP 200) for indexing/crawlers.
const staticRoutes = ['guide', 'support', 'privacy', 'terms'];

async function main() {
  // Keep SPA fallback for non-static routes.
  await copyFile(indexHtml, resolve(distDir, '404.html'));

  for (const route of staticRoutes) {
    const routeDir = resolve(distDir, route);
    await mkdir(routeDir, { recursive: true });
    await copyFile(indexHtml, resolve(routeDir, 'index.html'));
  }

  console.log('Prepared GitHub Pages static routes:', staticRoutes.join(', '));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
