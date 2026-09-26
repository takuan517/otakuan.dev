# otakuan.dev — Freelance Portfolio

Takumi Ishihara のフリーランス向けポートフォリオ。Astro / TypeScript / CSS による静的サイトです。既存のJekyllサイトとは独立しています。

## 開発

Node.js 22.19以上（推奨24 LTS）を使用してください。

```sh
npm ci
npm run dev
npm run check
npm run build
npm test
npm run preview
```

`dist/` を静的ホスティングへ配置します。想定ドメインは `https://otakuan.dev`。変更する場合は `astro.config.mjs` と `public/robots.txt` を更新してください。

## 構造

- `src/pages/`: Home / About / Services / Works / Contact、実績詳細、404、sitemap
- `src/layouts/Layout.astro`: metadata / canonical / 共通レイアウト
- `src/components/`: ナビゲーション、Hero、サービス・実績一覧、CTA、フォーム
- `src/data/site.ts`: 表示文言、サービス、技術、経歴、問い合わせ設定
- `src/content/works/*.md`: Astro Content Collectionsによる実績
- `src/content.config.ts`: 実績スキーマ
- `src/styles/global.css`: デザイントークンとレスポンシブスタイル

日本語文言は `ja` 辞書に集約しています。英語対応時には辞書・ローカライズしたサービスデータとルートを追加し、Layoutのlang、OG locale、canonicalも言語別に設定します。実績には `locale` フィールドがあります。現時点で英語ページはありません。

## 実績の追加と公開確認

既存Markdownをコピーして追加します。title / client / industry / description / role / technologies / year / url / featured / confidential / anonymized を編集します。`order` は表示順、`featured` はHome掲載（最大4件）、`published` はページ生成の可否です。未公開のデータは `published: false` にします。

現在の3件はユーザー指定の仮データで、`sample: true` と明示しています。サンプル詳細はnoindexとし、sitemapから除外しています。公開許諾・担当範囲を確認してから `sample: false` にしてください。年・顧客・外部URLは未確認のためnullです。架空の成果は記載していません。

匿名案件は公開用の安全なtitle / industry / description / 本文を記載し、`anonymized: true` または `confidential: true`、client / url はnullにします。スキーマでもclient / urlの漏出を防ぎますが、本文・タイトルの個人情報は編集者が確認してください。機密情報そのものをリポジトリへ保存しないでください。

経歴はWorksと別の `experience` 配列で管理します。公開確認前の企業名は経歴に追加していません。

## 問い合わせ

`src/data/site.ts` の `site.contactEndpoint` に確認済みのHTTPS外部フォーム送信先を設定します。必要に応じて `ContactForm.astro` のフィールド名をプロバイダーに合わせて変更してください。送信先が空の場合は入力と送信を無効にし、未設定であることを画面と支援技術の両方へ伝えます。成功を装う挙動はありません。

接続後はサービス側の送信成功・エラー表示、スパム対策、個人情報の取扱いを確認し、`site.contactPrivacyUrl` を設定してください。必須項目とメール形式はネイティブHTMLバリデーションを使用しています。独自バックエンド・クライアントJavaScriptはありません。

`site.profiles` に確認済み外部プロフィールを追加できます。メールアドレスやGitHub URLは推測して設定していません。

## 品質方針

システムフォント、画像不要のHero、静的HTML/CSS、JavaScript不要のナビゲーション。1ページ1h1、見出し階層、スキップリンク、現在位置、明示的なフォームラベル、キーボードフォーカスを備えています。

WCAG 2.2 AAを目標としています。自動検査だけで適合を断言するものではありません。公開時には実際の問い合わせサービスを含めたキーボード・スクリーンリーダー・ズーム確認も行ってください。

## 再検証

```sh
npm run check
npm run build
npm test
npx playwright install chromium
npm run preview -- --host 127.0.0.1 --port 4321
npm run test:browser
```

ブラウザーテストはaxe、5種類の画面幅、キーボードフォーカス、スキップリンク、200%文字拡大、JavaScript無効時のナビゲーションを確認します。結果とスクリーンショットは `reports/` に生成します。

Lighthouseは任意の検証ツールです。Chrome DevToolsのLighthouseから主要5ページをMobile設定で計測できます。サイトの常設依存には含めていません。今回の結果は `QUALITY.md` に記録しています。

Astro Content Collectionsの実装は [Astro公式ドキュメント](https://docs.astro.build/ja/reference/modules/astro-content/) に沿っています。

## デザイン更新

- ロゴマーク、番号ラベル、装飾コピー、内部リンクの斜め矢印を削除しました。罫線はヘッダー・フッターに限定しています。
- Heroは従来より約27%小さい文字サイズとし、氏名・職種・支援内容を上から自然に読める構成に変更しました。
- Servicesは2列の簡潔なグリッド（狭幅では1列）、Worksはプロジェクト名・説明・技術・任意の期間を確認するリストです。`url` が設定されている場合だけ外部リンクを表示します。`period`（例: `2024–2026`）は任意フィールドで、未設定時は `year` を使用します。実際の期間は推測していません。
- About本文は最大45rem（通常720px）。左右に見出しと本文を分ける構成を廃止しました。CTAとFooterも直接的な表現に整理しています。
