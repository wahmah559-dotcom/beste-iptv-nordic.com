const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
require('./generate-sitemap')();
// Only replace the fixed build directory inside this repository.
if (path.dirname(out) !== root) throw new Error('Unsafe output path');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const publicFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
for (const item of [...publicFiles, 'articles', 'assets', 'css', 'js', 'robots.txt', 'sitemap.xml', 'CNAME', '.nojekyll']) {
  fs.cpSync(path.join(root, item), path.join(out, item), { recursive: true });
}
console.log('Static production output written to dist/');
