import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const indexHtmlPath = resolve(distDir, 'index.html');

const routeSeo = {
  guide: {
    title: 'How to Build and Verify an AI Agent | tether.name',
    description:
      'Build an AI agent with modern runtimes and frameworks, then register it with tether.name for AI agent verification.',
    keywords: 'build ai agent, ai agent runtime, verify ai agent, ai agent verification, agentic verification',
    robots: 'index,follow',
    canonical: 'https://tether.name/guide/',
  },
  support: {
    title: 'Support | tether.name',
    description: 'Support resources for tether.name AI agent verification and agentic verification.',
    keywords: 'tether.name support, ai agent verification support',
    robots: 'index,follow',
    canonical: 'https://tether.name/support/',
  },
  privacy: {
    title: 'Privacy Policy | tether.name',
    description: 'Read the tether.name privacy policy for our AI agent verification platform.',
    keywords: 'tether.name privacy policy, ai agent verification privacy',
    robots: 'index,follow',
    canonical: 'https://tether.name/privacy/',
  },
  terms: {
    title: 'Terms of Service | tether.name',
    description: 'Read tether.name terms for using our AI agent verification service.',
    keywords: 'tether.name terms, ai agent verification terms',
    robots: 'index,follow',
    canonical: 'https://tether.name/terms/',
  },
};

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function upsertTag(html, regex, tag) {
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function withSeoTags(html, seo) {
  const titleTag = `<title>${escapeHtml(seo.title)}</title>`;
  html = html.replace(/<title>.*?<\/title>/is, titleTag);

  const canonicalTag = `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`;
  html = upsertTag(html, /<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag);

  html = upsertTag(
    html,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  );
  html = upsertTag(
    html,
    /<meta\s+name=["']keywords["'][^>]*>/i,
    `<meta name="keywords" content="${escapeHtml(seo.keywords)}" />`,
  );
  html = upsertTag(
    html,
    /<meta\s+name=["']robots["'][^>]*>/i,
    `<meta name="robots" content="${escapeHtml(seo.robots)}" />`,
  );

  html = upsertTag(
    html,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`,
  );
  html = upsertTag(
    html,
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
  );
  html = upsertTag(
    html,
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
  );

  html = upsertTag(
    html,
    /<meta\s+name=["']twitter:url["'][^>]*>/i,
    `<meta name="twitter:url" content="${escapeHtml(seo.canonical)}" />`,
  );
  html = upsertTag(
    html,
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
  );
  html = upsertTag(
    html,
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
  );

  return html;
}

async function main() {
  const baseHtml = await readFile(indexHtmlPath, 'utf8');

  // Keep SPA fallback for non-static routes.
  await copyFile(indexHtmlPath, resolve(distDir, '404.html'));

  for (const [route, seo] of Object.entries(routeSeo)) {
    const routeDir = resolve(distDir, route);
    await mkdir(routeDir, { recursive: true });

    const routeHtml = withSeoTags(baseHtml, seo);
    await writeFile(resolve(routeDir, 'index.html'), routeHtml, 'utf8');
  }

  console.log('Prepared GitHub Pages static routes with route-specific SEO:', Object.keys(routeSeo).join(', '));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
