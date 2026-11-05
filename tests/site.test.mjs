import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
test('landing page: accessible, public, candid about scientific status',async()=>{
 const html=await readFile('dist/index.html','utf8');
 assert.match(html,/<html lang="en">/);
 assert.match(html,/<main id="main">/);
 assert.match(html,/<nav aria-label="Main navigation">/);
 assert.match(html,/<a class="skip"/);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 for(const id of ['mission','research','roadmap','participate'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(html,/not yet a systematic review/i);
 assert.match(html,/not yet a registered foundation/i);
 assert.match(html,/github\.com\/saver1991\/human-prosperity-initiative\/issues\/8/);
 assert.doesNotMatch(html,/<form|google-analytics|googletagmanager|facebook\.com\/tr/i);
});
test('static assets and CircleCI configuration',async()=>{
 await stat('dist/styles.css');await stat('dist/favicon.svg');
 const cfg=JSON.parse(await readFile('vercel.json','utf8'));
 assert.equal(cfg.outputDirectory,'dist');
 assert.ok(cfg.headers.length);
 const ci=await readFile('.circleci/config.yml','utf8');
 assert.match(ci,/npm run check/);
 assert.doesNotMatch(ci,/github-actions|uses:\s*actions\//i);
});
