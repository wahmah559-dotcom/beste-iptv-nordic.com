#!/usr/bin/env node
// Regenerates sitemap.xml from the current set of pages and articles.
// Run this after adding, removing, or renaming any page/article:
//   node scripts/generate-sitemap.js

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const domain = 'https://beste-iptv-nordic.com';
const today = new Date().toISOString().slice(0, 10);

const pages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
  { loc: '/pricing.html', priority: '0.9', changefreq: 'weekly', lastmod: today },
  { loc: '/blog.html', priority: '0.7', changefreq: 'weekly', lastmod: today },
  { loc: '/contact.html', priority: '0.7', changefreq: 'monthly', lastmod: today },
];

function extractPublishedDate(html) {
  const match = html.match(/<meta property="article:published_time" content="([^"]+)">/);
  return match ? match[1] : today;
}

const articlesDir = path.join(root, 'articles');
const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html')).sort();

const articles = articleFiles.map(file => {
  const html = fs.readFileSync(path.join(articlesDir, file), 'utf8');
  return {
    loc: `/articles/${file}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: extractPublishedDate(html),
  };
});

const entries = [...pages, ...articles];

function urlBlock({ loc, priority, changefreq, lastmod }) {
  const full = `${domain}${loc}`;
  return [
    '  <url>',
    `    <loc>${full}</loc>`,
    `    <xhtml:link rel="alternate" hreflang="nb-NO" href="${full}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${full}" />`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries.map(urlBlock),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml regenerated with ${entries.length} URLs (${pages.length} pages, ${articles.length} articles).`);
