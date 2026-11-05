import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('site/index.html', 'dist/index.html');
await cp('site/styles.css', 'dist/styles.css');
await cp('site/favicon.svg', 'dist/favicon.svg');
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: https://human-prosperity-initiative.vercel.app/sitemap.xml\n');
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://human-prosperity-initiative.vercel.app/</loc></url></urlset>\n');
console.log('HPI: static website built, no dependencies and no secrets.');
