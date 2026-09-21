# 品質確認

2026-09-12 / Astro 7.3.2 / Node.js 24.19.0 / Chromium 153

## 結果

- Astro build: 成功。主要5ページ、Shell、実績詳細3ページ、404、sitemapを静的生成。
- Astro check: TypeScriptエラーなし。
- html-validate: 全10ページ合格。h1は各1つ、見出し階層・内部リンクも検証。
- axe: 全10ページ、390px / 1440pxでWCAG 2 / 2.1 / 2.2 AA関連ルールの違反0。
- Responsive: 320 / 390 / 768 / 1440 / 1920px、全10ページで横溢れなし。
- Keyboard: 全10ページのリンクをTab移動。スキップリンクのEnterでmainにフォーカス。すべての操作対象で明確なoutlineを確認。
- 拡大: 1440pxで200%文字拡大、全10ページで横溢れなし。320pxのリフローも確認。ブラウザーUIのズーム操作そのものではなく、文字拡大と狭幅での検証。
- Motion: reduced-motion有効で検証。通常状態でもアニメーションなし。
- JavaScript無効: 全10ページを閲覧し、Contactへのナビゲーションを確認。生成HTMLにscriptタグなし。
- フォーム: 送信先未設定時はfieldset・送信ボタン無効。状態説明と全項目のlabelを確認。
- スクリーンショット: HomeとShellのdesktop/mobileを目視確認。
- npm audit: 常設依存の既知脆弱性0件。Lighthouseは検証時のみ使用し、常設依存から除外。

## 初回実装時のLighthouse（Mobile / ローカル静的プレビュー）

| Page | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Home | 100 | 100 | 100 | 100 |
| About | 100 | 100 | 100 | 100 |
| Services | 100 | 100 | 100 | 100 |
| Works | 100 | 100 | 100 | 100 |
| Contact | 100 | 100 | 100 | 100 |

実行時のJSON / HTMLは `reports/lighthouse-*.json` / `reports/lighthouse-*.html` に保存。

本番ネットワーク・ホスティングでの実測ではありません。実績詳細のサンプルと404は意図的にnoindexです。

## 公開前の残項目

- 仮の実績・約7年間のプロフィール文章・スキルの最終確認。
- 実績の公開許諾・担当範囲の確認。未確認の企業経歴は未掲載。
- 問い合わせサービス接続と送信成功・エラー・プライバシー表示の確認。
- 外部プロフィールリンクの設定。
- 実機スクリーンリーダー、ブラウザーUIでのズーム、公開環境での最終確認。

自動検査の合格はWCAGの完全な適合認証を意味しません。

## デザイン更新後の検証

番号ラベル、ロゴマーク、装飾コピー、内部リンクの斜め矢印を撤去。通常ページは情報中心のレイアウトへ変更し、Shellを追加しました。

全10ページのHTML検証、型チェック、axe（390 / 1440px）、5種類の画面幅、200%文字拡大、キーボード操作、JavaScript無効時の移動を再検証して合格。画面上のShellプロンプトはaria-hiddenで読み上げから除外し、内容は通常のHTML見出し・リストとして提供しています。コマンド入力は未実装です。

最新の自動検証結果は `reports/browser.json`、新しいLighthouseレポートは `reports/revised-*.report.json` / `.html` に保存しています。上記の初回5ページのスコアとは区別してください。

| 更新後のページ | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| home | 100 | 100 | 100 | 100 |
| shell | 100 | 100 | 100 | 100 |
