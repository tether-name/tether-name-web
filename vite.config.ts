import { defineConfig } from 'vite'
import type { IndexHtmlTransformContext } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Production CSP — no 'unsafe-inline' for scripts, no localhost.
const PROD_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://api.tether.name",
  "img-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ')

function cspPlugin() {
  return {
    name: 'html-csp-production',
    transformIndexHtml(html: string, ctx: IndexHtmlTransformContext) {
      // ctx.bundle is only truthy during `vite build`, not dev serve
      if (!ctx.bundle) return html
      return html.replace(
        /<meta\s+http-equiv="Content-Security-Policy"\s+content="[^"]*"\s*\/?>/,
        `<meta http-equiv="Content-Security-Policy" content="${PROD_CSP}" />`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cspPlugin()],
})
