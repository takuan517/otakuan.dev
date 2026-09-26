import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/contact.js';
const env = { RESEND_API_KEY: 'test', TURNSTILE_SECRET_KEY: 'test', CONTACT_FROM: 'form@notify.otakuan.dev', CONTACT_ORIGIN: 'https://otakuan.dev' };
const fields = { name: 'テスト', email: 'visitor@example.com', message: '問い合わせ', 'cf-turnstile-response': 'token' };
function request(values = fields, origin = env.CONTACT_ORIGIN) { return new Request('https://otakuan.dev/api/contact', { method: 'POST', headers: { Origin: origin }, body: new URLSearchParams(values) }); }
test('contact validation and delivery', async () => {
  const original = globalThis.fetch;
  let calls = [];
  let valid = true, sendOk = true, hostname = 'otakuan.dev';
  globalThis.fetch = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return url.includes('siteverify') ? Response.json({ success: valid, hostname, action: 'contact' }) : Response.json(sendOk ? { id: 'accepted' } : { message: 'failed' }, { status: sendOk ? 200 : 500 });
  };
  try {
    assert.equal((await onRequest({ request: request(), env: {} })).status, 503);
    assert.equal((await onRequest({ request: request(fields, 'https://evil.example'), env })).status, 403);
    assert.equal((await onRequest({ request: request({ ...fields, email: 'bad' }), env })).status, 400);
    assert.equal((await onRequest({ request: request({ ...fields, website: 'spam' }), env })).status, 400);
    assert.equal((await onRequest({ request: request({ ...fields, message: 'x'.repeat(160000) }), env })).status, 413);
    assert.equal(calls.length, 0);
    valid = false;
    assert.equal((await onRequest({ request: request(), env })).status, 400);
    assert.equal(calls.length, 1);
    valid = true; hostname = 'evil.example';
    assert.equal((await onRequest({ request: request(), env })).status, 400);
    hostname = 'otakuan.dev'; sendOk = false;
    assert.equal((await onRequest({ request: request(), env })).status, 502);
    sendOk = true;
    const response = await onRequest({ request: request(), env });
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('Location'), '/contact/thanks/');
    assert.deepEqual(calls.at(-1).body.to, ['contact@otakuan.dev']);
    assert.equal(calls.at(-1).body.reply_to, 'visitor@example.com');
    globalThis.fetch = async () => { throw new Error('timeout'); };
    assert.equal((await onRequest({ request: request(), env })).status, 503);
  } finally { globalThis.fetch = original; }
});
