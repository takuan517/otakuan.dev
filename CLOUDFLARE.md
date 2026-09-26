# 公開と問い合わせフォームの設定

ドメイン契約はSquarespace、DNSとWebはCloudflare、メール受信はGoogle Workspaceを利用します。

## DNS

1. Squarespaceの現在のDNSレコードを保存します。Google WorkspaceのMX、SPF、DKIM、DMARC、所有権確認レコードなどを含め、すべて確認します。
2. Cloudflareへotakuan.devを追加し、自動取り込みに漏れたレコードを補います。DKIMなどは自動検出されないことがあります。既存のメール用レコードは置き換えません。
3. DNSSECが有効な場合は、Cloudflareの移行手順に従って古いDSレコードを解除してからネームサーバーを変更し、移行後に再設定します。
4. レコード照合後、SquarespaceでCloudflare指定のネームサーバーへ変更します。ドメインの移管は不要です。
5. Google Workspaceの送受信を確認します。

## Cloudflare Pages

Gitリポジトリを接続し、build commandを `npm run build`、output directoryを `dist`、Nodeを24に設定します。`functions/api/contact.js` はPages Functionsとしてデプロイします。distだけのドラッグ＆ドロップではFunctionsを配置できません。

最初はフォーム無効のままプレビューします。PagesのCustom domainsからotakuan.devを追加します。PagesのルートドメインにはCloudflare DNSが必要です。

## メール送信と認証

- Resendで `notify.otakuan.dev` など専用サブドメインを検証し、指定されたDNSを追加します。Google WorkspaceのルートドメインのMX・SPFを上書きしないでください。
- Resendで送信専用APIキーを作成します。
- Cloudflare Turnstileで本番ホスト名 `otakuan.dev` のManagedウィジェットを作成します。
- Pages Functionsの秘密設定に `RESEND_API_KEY` と `TURNSTILE_SECRET_KEY` を登録します。
- Functionsの変数に `CONTACT_FROM`（検証済み送信元、例 `Website <form@notify.otakuan.dev>`）と `CONTACT_ORIGIN=https://otakuan.dev` を登録します。
- ビルド変数に `PUBLIC_TURNSTILE_SITE_KEY` と `PUBLIC_CONTACT_ENABLED=true` を設定して再デプロイします。
- Previewでは本番の秘密設定を使わず、フォームを無効にしてください。

送信先はcontact@otakuan.dev固定、Reply-Toは問い合わせ者です。Google Workspaceのパスワードは不要です。送信処理は本文をログへ出力しません。Turnstileのサーバー検証、ホスト・action検証、入力長上限、Origin検証、隠しフィールドを使用します。

## 検証

`node --test scripts/contact.test.mjs` は外部通信をモックし、実メールを送りません。`npm run check && npm run build && npm test` で静的サイトを検証します。

公開環境で有効化後、フォーム送信、Workspaceへの着信、返信先、入力エラー、認証失敗、モバイル表示を確認します。Resendの受付成功は最終的な受信完了の保証ではありません。失敗時は成功表示せず、戻る操作と直接メールの案内を表示します。フォームは迷惑送信対策のためJavaScriptが必要です。

公式資料:
- https://developers.cloudflare.com/pages/configuration/custom-domains/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://resend.com/docs/dashboard/domains/introduction
