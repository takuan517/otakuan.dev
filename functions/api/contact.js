const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const failure = (status, message) => new Response(`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>お問い合わせの送信について</title><main><h1>送信できませんでした</h1><p>${message}</p><p>ブラウザーの戻る操作で入力内容を確認して、もう一度お試しください。</p><p>解決しない場合は contact@otakuan.dev へ直接メールをお送りください。</p><a href="/contact/">お問い合わせへ戻る</a></main></html>`, { status, headers });

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY || !env.CONTACT_FROM || !env.CONTACT_ORIGIN) return failure(503, '現在フォームを利用できません。');
  const configuredOrigin = env.CONTACT_ORIGIN.replace(/\/$/, '');
  const allowedOrigins = new Set([configuredOrigin, configuredOrigin.replace('://', '://www.')]);
  if (!allowedOrigins.has(request.headers.get('Origin')) || !allowedOrigins.has(new URL(request.url).origin)) return failure(403, '送信元を確認できませんでした。');
  if (!request.headers.get('Content-Type')?.startsWith('application/x-www-form-urlencoded')) return failure(415, '送信形式を確認してください。');
  try {
    // Limit streamed bytes, including requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return failure(400, '入力内容を確認してください。');
    const chunks = []; let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 150000) { await reader.cancel(); return failure(413, '入力内容が長すぎます。'); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const form = new URLSearchParams(new TextDecoder().decode(bytes));
    const get = (key) => (form.get(key) ?? '').trim();
    const name = get('name'), company = get('company'), email = get('email'), message = get('message'), token = get('cf-turnstile-response');
    if (get('website') || !name || name.length > 200 || company.length > 200 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || message.length > 10000 || !token || token.length > 2048) return failure(400, '必須項目・メールアドレス・迷惑送信対策の認証を確認してください。');
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }), signal: AbortSignal.timeout(10000),
    });
    if (!verification.ok) return failure(503, '認証サービスに接続できませんでした。');
    const result = await verification.json();
    const allowedHosts = new Set([...allowedOrigins].map((origin) => new URL(origin).hostname));
    if (!result.success || !allowedHosts.has(result.hostname) || result.action !== 'contact') return failure(400, '認証が期限切れか、確認できませんでした。再度認証してください。');
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.CONTACT_FROM, to: ['contact@otakuan.dev'], reply_to: email, subject: 'otakuan.devからのお問い合わせ', text: `お名前: ${name}\n会社名: ${company || '未入力'}\nメール: ${email}\n\n${message}` }), signal: AbortSignal.timeout(10000),
    });
    if (!sent.ok || !(await sent.json()).id) return failure(502, 'メールの送信受付を確認できませんでした。');
    return new Response(null, { status: 303, headers: { Location: '/contact/thanks/', 'Cache-Control': 'no-store' } });
  } catch { return failure(503, '通信に失敗しました。'); }
}

export default { fetch: (request, env) => onRequest({ request, env }) };
