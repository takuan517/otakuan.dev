import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { HtmlValidate } from 'html-validate';
const validator = new HtmlValidate({ extends: ['html-validate:recommended'], rules: { 'void-style': 'off', 'no-trailing-whitespace': 'off', 'long-title': 'off', 'no-inline-style': 'off' } });
const files = (await fs.readdir('dist', { recursive: true })).filter((name) => name.endsWith('.html'));
assert.ok(files.length >= 10, 'All expected pages generated');
for (const file of files) {
  const html = await fs.readFile(path.join('dist', file), 'utf8');
  const result = await validator.validateString(html, file);
  assert.ok(result.valid, `${file}: ${JSON.stringify(result.results.flatMap((r) => r.messages), null, 2)}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${file}: one h1`);
  assert.ok(html.includes('lang="ja"'), `${file}: Japanese language`);
  assert.ok(html.includes('href="#main"'), `${file}: skip link`);
  assert.ok(!/<script(?:\s|>)/.test(html), `${file}: no client JavaScript`);
  const headings = [...html.matchAll(/<h([1-6])(?:\s|>)/g)].map((m) => Number(m[1]));
  headings.forEach((level, i) => assert.ok(i === 0 || level <= headings[i - 1] + 1, `${file}: heading hierarchy`));
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)(?:#[^"]*)?"/g)) {
    const destination = href.endsWith('/') ? `${href}index.html` : href;
    await fs.access(path.join('dist', destination));
  }
}
const contact = await fs.readFile('dist/contact/index.html', 'utf8');
assert.match(contact, /<fieldset disabled/);
assert.ok(!contact.includes('action="https://'), 'No inferred form destination');
console.log(`PASS: ${files.length} pages — valid HTML, headings, internal links, metadata language, no client scripts, unconfigured form safely disabled.`);
