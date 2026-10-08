#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const domain = 'https://beste-iptv-nordic.com';
// Explicit content dates, preserved from the existing sitemap. Update only
// after a substantive change; omit unknown dates rather than using build time.
const dates = require('./sitemap-dates.json');
const files = [...fs.readdirSync(root).filter(f => f.endsWith('.html')),
  ...fs.readdirSync(path.join(root, 'articles')).filter(f => f.endsWith('.html')).map(f => 'articles/' + f)].sort();
function generate() {
  const entries = files.flatMap(file => {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const loc = file === 'index.html' ? '/' : '/' + file;
    const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
    if (canonical !== domain + loc || /<meta\b[^>]*(?:name|http-equiv)="(?:robots|googlebot|X-Robots-Tag)"[^>]*content="[^"]*\b(?:noindex|none)\b/i.test(html) || /http-equiv="refresh"/i.test(html)) return [];
    const lastmod = html.match(/<meta\b[^>]*property="article:modified_time"[^>]*content="([^"]+)"/i)?.[1] || dates[loc];
    if (lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) throw new Error('Invalid date: ' + loc);
    return ['  <url>\n    <loc>' + canonical + '</loc>' + (lastmod ? '\n    <lastmod>' + lastmod + '</lastmod>' : '') + '\n  </url>'];
  });
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries.join('\n') + '\n</urlset>\n';
  fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
  console.log('Generated sitemap with ' + entries.length + ' canonical, indexable URLs.');
}
if (require.main === module) generate();
module.exports = generate;
