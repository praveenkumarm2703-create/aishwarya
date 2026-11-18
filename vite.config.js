import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import config from './src/config.js';

// Absolute site URL for link previews (WhatsApp needs an absolute og:image URL).
// Vercel provides VERCEL_PROJECT_PRODUCTION_URL automatically; Netlify provides URL.
// You can also set SITE_URL yourself, e.g. SITE_URL=https://my-surprise.vercel.app
function siteUrl() {
  const raw =
    process.env.SITE_URL ||
    process.env.URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    '';
  return raw.replace(/\/$/, '');
}

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function injectMeta() {
  return {
    name: 'inject-meta',
    transformIndexHtml(html) {
      const url = siteUrl();
      return html
        .replaceAll('%SITE_TITLE%', escape(config.site.title))
        .replaceAll('%SITE_DESCRIPTION%', escape(config.site.description))
        .replaceAll('%THEME_COLOR%', escape(config.site.themeColor))
        .replaceAll('%SITE_URL%', url ? `${url}/` : '/')
        .replaceAll('%OG_IMAGE%', `${url}/og-image.jpg`);
    },
  };
}

export default defineConfig({
  plugins: [react(), injectMeta()],
  server: { host: true },
});
