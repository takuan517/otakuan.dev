export const site = {
  name: 'Takumi Ishihara',
  domain: 'otakuan.dev',
  role: 'Software Engineer / Technical Consultant',
  locale: 'ja' as const,
  // Set only after confirming the external provider and its privacy policy.
  contactEndpoint: '',
  contactPrivacyUrl: '',
  profiles: [] as { label: string; url: string }[],
};
export const routes = ['/', '/about/', '/services/', '/works/', '/contact/'];
export const ja = {
  nav: [{ label: 'About', href: '/about/' }, { label: 'Services', href: '/services/' }, { label: 'Works', href: '/works/' }, { label: 'Contact', href: '/contact/' }],
  description: 'Takumi Ishihara — Webアプリケーションの設計・開発からインフラ・ネットワークまで。技術コンサルティング、PoC、システム開発を支援します。',
  hero: { intro: 'Webアプリケーションの設計・開発を中心に、\nバックエンド、インフラ、ネットワークまで扱っています。', description: '技術コンサルティングやPoCのご相談にも対応しています。', works: 'View Works', contact: 'Contact' },
  availability: 'Available for Projects',
  cta: { title: 'Have a project in mind?', description: '業務委託、技術コンサルティング、スポットでの技術支援についてご相談を受け付けています。', note: '継続・スポットいずれも対応可能です。\n要件がまだ固まっていない段階でも構いません。' },
  about: { title: 'About', intro: 'Webアプリケーションを中心に、バックエンド、インフラ、ネットワークまで。領域を横断しながら、目的に合ったシステムを考え、形にします。', paragraphs: ['Webエンジニアとして約7年間、Webサービス、業務システム、Webサイトなどの設計・開発に携わってきました。', 'フロントエンドからバックエンド、データベース、クラウド・インフラまで幅広く経験し、ネットワーク技術を組み合わせたシステム開発や技術コンサルティングにも取り組んでいます。'], experienceNote: '公開可能な経歴を準備中です。具体的な制作・開発内容はWorksにまとめています。' },
  services: { title: 'Services', intro: 'つくることも、技術的な判断を支えることも。プロジェクトの段階や課題に合わせて、必要なところから支援します。' },
  works: { title: 'Works', intro: 'Web、システム、ネットワーク。さまざまな領域での設計・開発と技術支援。', sampleNotice: '掲載内容はサンプルです。実績の公開可否・担当範囲を確認後、正式な内容へ更新します。', sampleLabel: 'Sample / 公開確認前', back: 'All Works', detail: '実績の詳細', technology: 'Technologies', role: 'Role', client: 'Client / Industry', year: 'Year', pending: '確認中', external: 'プロジェクトのWebサイト' },
  contact: { title: 'Contact', intro: '要件が固まっていない段階でもご相談いただけます。\nまずは、考えていることやお困りのことをお聞かせください。', examplesTitle: 'こんなご相談から', examples: ['Webサービスを新しく開発したい', '既存システムを改善したい', '技術選定について相談したい', 'インフラ・ネットワークまで含めて相談したい', 'PoCを一緒に作ってほしい', '技術提案をレビューしてほしい'], formTitle: 'プロジェクトについて', labels: { name: 'Name / お名前', company: 'Company / 会社名', email: 'Email / メールアドレス', message: 'Message / ご相談内容' }, required: '必須', optional: '任意', unavailable: 'フォームは現在準備中です。送信先が未設定のため、このフォームからは送信できません。', messageHint: 'ご相談内容、時期、ご予算など、分かる範囲でご記入ください。', submit: 'Send message', disabled: '送信準備中', privacy: '送信先サービスのプライバシーポリシー', profiles: 'Elsewhere', profilesPending: '外部プロフィールのリンクは準備中です。' },
  home: { services: 'Services', servicesIntro: 'ソフトウェアを軸に、\nシステム全体を見渡す。', works: 'Selected Works', about: 'About', allServices: 'Explore Services', allWorks: 'View All Works', moreAbout: 'More about me' },
};
export const copy = { ja };
export const services = [
  { id: 'web-development', title: 'Web Application Development', summary: 'Webサービス、業務システム、新規Webアプリケーション、既存サービス改善、API開発。フロントエンドからバックエンドまで対応します。', description: 'サービスの目的と利用者の課題を整理し、要件整理、設計、実装、テスト、運用まで一貫して支援します。既存システムの改善や、一部機能の開発からもご相談いただけます。', items: ['新規Webサービス・業務システム開発', 'フロントエンド・バックエンド開発', 'API設計・開発、外部システム連携', '既存サービスの改善・運用支援'] },
  { id: 'technical-consulting', title: 'Technical Consulting', summary: '技術選定、アーキテクチャ設計、技術レビュー、ベンダー提案評価。技術的な判断とシステム改善を支援します。', description: 'コードを書く前の意思決定も、大切な仕事です。事業の目的や制約を踏まえ、選択肢とトレードオフを整理します。技術的な懸念を言葉にし、次に進むための判断を支えます。', items: ['技術選定・技術調査・技術相談', 'アーキテクチャ設計・レビュー', '技術提案のレビュー・ベンダー提案評価', 'システム改善の検討'] },
  { id: 'infrastructure-network', title: 'Infrastructure & Network', summary: 'クラウド、Linux、サーバ、ネットワーク。Webシステムとインフラを跨いだ設計・構築・運用を支援します。', description: 'アプリケーションだけでなく、その土台となるインフラや通信まで含めて設計します。運用を見据えた構成の検討から、構築・自動化まで対応します。', items: ['Cloud Infrastructure / Linux / Server', 'Network / DNS / Routing', 'インフラ・ネットワークの自動化', 'Webシステムとインフラを跨いだ設計'] },
  { id: 'poc-prototyping', title: 'PoC & Prototyping', summary: '新技術の検証、PoC、プロトタイプ開発。要件が完全に固まっていない段階から、アイデアを動く形にします。', description: '何を確かめたいのかを一緒に整理し、小さく実装して検証します。アイデアや要求がまだ曖昧な段階から、技術的な実現性と次の開発に必要な知見を探ります。', items: ['新技術の調査・実現性検証', '技術PoCの設計・実装', '短期間のプロトタイプ開発', '検証結果の整理・次段階の検討'] },
];
// Add only approved public experience. Keep separate from project work.
export const experience: { company: string; role: string; period: string; description: string }[] = [];
export const technologies = [
  { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Ruby', 'Go', 'Python'] },
  { category: 'Frontend', items: ['React', 'Next.js', 'Nuxt', 'Astro'] },
  { category: 'Backend', items: ['Ruby on Rails', 'Django', 'NestJS'] },
  { category: 'Infrastructure', items: ['Linux', 'Docker', 'GCP', 'Cloud / Server Infrastructure'] },
  { category: 'Network', items: ['TCP/IP', 'DNS', 'Routing', 'Network Automation'] },
];
