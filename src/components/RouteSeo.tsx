import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://tether.name';
const OG_IMAGE_URL = `${SITE_URL}/og.png`;

interface SeoConfig {
  title: string;
  description: string;
  keywords: string;
  robots: string;
  canonicalPath: string;
}

function setMetaByName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function setMetaByProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function setCanonical(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function getSeoConfig(rawPathname: string): SeoConfig {
  const pathname = normalizePathname(rawPathname);

  if (pathname === '/') {
    return {
      title: 'AI Agent Verification & Agentic Verification | tether.name',
      description:
        'Verify AI agent identity with signed one-time challenges. tether.name helps users and teams prevent agent impersonation and safely verify AI agents in real conversations.',
      keywords:
        'ai agent verification, verify ai agent, agentic verification, ai identity verification, ai agent trust, ai agent authentication',
      robots: 'index,follow',
      canonicalPath: '/',
    };
  }

  if (pathname === '/guide') {
    return {
      title: 'How to Build and Verify an AI Agent | tether.name',
      description:
        'Build an AI agent with modern runtimes and frameworks, then register it with tether.name so people can verify AI agent identity.',
      keywords:
        'build ai agent, ai agent runtime, verify ai agent, ai agent verification',
      robots: 'index,follow',
      canonicalPath: '/guide/',
    };
  }

  if (pathname === '/ai-agent-verification') {
    return {
      title: 'AI Agent Verification Guide | tether.name',
      description:
        'Learn how to verify AI agents with signed one-time challenges and reduce impersonation risk in agentic workflows.',
      keywords:
        'ai agent verification, verify ai agent, agentic verification, ai identity verification',
      robots: 'index,follow',
      canonicalPath: '/ai-agent-verification/',
    };
  }

  if (pathname === '/verify-ai-agent') {
    return {
      title: 'Verify AI Agent Checklist | tether.name',
      description:
        'Step-by-step checklist to verify AI agent identity using one-time challenges and signed verification links.',
      keywords:
        'verify ai agent, ai agent verification checklist, agent identity verification, agentic verification',
      robots: 'index,follow',
      canonicalPath: '/verify-ai-agent/',
    };
  }

  if (pathname === '/privacy' || pathname === '/terms' || pathname === '/support') {
    return {
      title: `tether.name ${pathname.slice(1).charAt(0).toUpperCase()}${pathname.slice(2)}`,
      description: 'tether.name legal and support information.',
      keywords: 'tether.name',
      robots: 'index,follow',
      canonicalPath: `${pathname}/`,
    };
  }

  if (
    pathname === '/auth' ||
    pathname === '/challenge' ||
    pathname === '/check' ||
    pathname.startsWith('/dashboard')
  ) {
    return {
      title: 'tether.name',
      description: 'tether.name agent verification tools.',
      keywords: 'tether.name',
      robots: 'noindex,nofollow',
      canonicalPath: pathname,
    };
  }

  return {
    title: 'Page Not Found | tether.name',
    description: 'The page you requested could not be found.',
    keywords: 'tether.name',
    robots: 'noindex,nofollow',
    canonicalPath: pathname,
  };
}

export function RouteSeo() {
  const location = useLocation();

  useEffect(() => {
    const config = getSeoConfig(location.pathname);
    const canonicalUrl = new URL(config.canonicalPath, SITE_URL).toString();

    document.title = config.title;

    setMetaByName('description', config.description);
    setMetaByName('keywords', config.keywords);
    setMetaByName('robots', config.robots);

    setMetaByProperty('og:type', 'website');
    setMetaByProperty('og:url', canonicalUrl);
    setMetaByProperty('og:title', config.title);
    setMetaByProperty('og:description', config.description);
    setMetaByProperty('og:image', OG_IMAGE_URL);

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:url', canonicalUrl);
    setMetaByName('twitter:title', config.title);
    setMetaByName('twitter:description', config.description);
    setMetaByName('twitter:image', OG_IMAGE_URL);

    setCanonical(canonicalUrl);
  }, [location.pathname]);

  return null;
}
