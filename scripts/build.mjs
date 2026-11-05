import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('site/index.html', 'dist/index.html');
await cp('site/styles.css', 'dist/styles.css');
await cp('site/favicon.svg', 'dist/favicon.svg');
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\n');
console.log('HPI: static website built, no dependencies and no secrets.');
