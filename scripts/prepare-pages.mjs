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
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'How to Build and Verify an AI Agent',
      url: 'https://tether.name/guide/',
      description:
        'Build an AI agent with modern runtimes and frameworks, then register it with tether.name for verification.',
    },
  },
  'ai-agent-verification': {
    title: 'AI Agent Verification Guide | tether.name',
    description:
      'Learn how to verify AI agents with signed one-time challenges and reduce impersonation risk in agentic workflows.',
    keywords: 'ai agent verification, verify ai agent, agentic verification, ai identity verification, ai agent trust',
    robots: 'index,follow',
    canonical: 'https://tether.name/ai-agent-verification/',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'AI Agent Verification Guide',
          url: 'https://tether.name/ai-agent-verification/',
          description:
            'Learn how to verify AI agents with signed one-time challenges and reduce impersonation risk in agentic workflows.',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is AI agent verification?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'AI agent verification confirms that an agent is tied to a registered identity and not an impersonator.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do I verify an AI agent?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'Create a one-time challenge, send it to the agent, and open the returned check link to confirm verified status.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is agentic verification?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'Agentic verification is a trust layer for autonomous AI workflows that helps users validate agent identity before acting.',
              },
            },
          ],
        },
      ],
    },
  },
  'verify-ai-agent': {
    title: 'Verify AI Agent Checklist | tether.name',
    description:
      'Step-by-step checklist to verify AI agent identity using one-time challenges and signed verification links.',
    keywords: 'verify ai agent, ai agent verification checklist, agent identity verification, agentic verification',
    robots: 'index,follow',
    canonical: 'https://tether.name/verify-ai-agent/',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'Verify AI Agent Checklist',
          url: 'https://tether.name/verify-ai-agent/',
          description:
            'Step-by-step checklist to verify AI agent identity using one-time challenges and signed verification links.',
        },
        {
          '@type': 'HowTo',
          name: 'How to verify an AI agent',
          step: [
            {
              '@type': 'HowToStep',
              name: 'Generate challenge',
              text: 'Generate a one-time challenge code in tether.name.',
            },
            {
              '@type': 'HowToStep',
              name: 'Send to agent',
              text: 'Send the challenge code to the AI agent in the live conversation.',
            },
            {
              '@type': 'HowToStep',
              name: 'Confirm result',
              text: 'Open the returned check link and confirm verified identity and domain.',
            },
          ],
        },
      ],
    },
  },
  support: {
    title: 'Support | tether.name',
    description: 'Support resources for tether.name AI agent verification and agentic verification.',
    keywords: 'tether.name support, ai agent verification support',
    robots: 'index,follow',
    canonical: 'https://tether.name/support/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'tether.name support',
      url: 'https://tether.name/support/',
      email: 'support@tether.name',
    },
  },
  privacy: {
    title: 'Privacy Policy | tether.name',
    description: 'Read the tether.name privacy policy for our AI agent verification platform.',
    keywords: 'tether.name privacy policy, ai agent verification privacy',
    robots: 'index,follow',
    canonical: 'https://tether.name/privacy/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy Policy',
      url: 'https://tether.name/privacy/',
    },
  },
  terms: {
    title: 'Terms of Service | tether.name',
    description: 'Read tether.name terms for using our AI agent verification service.',
    keywords: 'tether.name terms, ai agent verification terms',
    robots: 'index,follow',
    canonical: 'https://tether.name/terms/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Terms of Service',
      url: 'https://tether.name/terms/',
    },
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

function upsertRouteStructuredData(html, structuredData) {
  const json = JSON.stringify(structuredData, null, 2).replace(/</g, '\\u003c');
  const tag = `<script type="application/ld+json" id="structured-data-route">\n${json}\n    </script>`;

  if (/<script\s+type=["']application\/ld\+json["']\s+id=["']structured-data-route["'][\s\S]*?<\/script>/i.test(html)) {
    return html.replace(
      /<script\s+type=["']application\/ld\+json["']\s+id=["']structured-data-route["'][\s\S]*?<\/script>/i,
      tag,
    );
  }

  return html.replace('</head>', `    ${tag}\n  </head>`);
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

  return upsertRouteStructuredData(html, seo.structuredData);
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

  console.log(
    'Prepared GitHub Pages static routes with route-specific SEO + structured data:',
    Object.keys(routeSeo).join(', '),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
